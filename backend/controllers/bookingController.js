
import Booking from '../models/Booking.js';
import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';
import Package from '../models/Package.js';
import Guide from '../models/Guide.js';
import Transport from '../models/Transport.js';
import BookingService from '../models/BookingService.js';
import Document from '../models/Document.js';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import CommunicationLog from '../models/CommunicationLog.js';
import { generateBookingPDF as generateBookingPDFHelper } from '../services/pdfService.js';

/**
 * @desc    Create a new booking from a lead
 * @route   POST /api/bookings
 * @access  Private (Sales Agent, Admin)
 */
export const createBooking = async (req, res, next) => {
    try {
        const { lead_id, customer_id, package_id, travel_start_date, travel_end_date,
            num_travelers, special_requirements, services } = req.body;

        // Validate lead exists and is in correct status
        const lead = await Lead.findById(lead_id);
        if (!lead || lead.status !== 'converted') {
            return res.status(400).json({ error: 'Invalid lead or lead not ready for booking' });
        }

        // Validate customer exists
        const customer = await Customer.findById(customer_id);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Validate package exists and is active
        const tourPackage = await Package.findById(package_id);
        if (!tourPackage || !tourPackage.is_active) {
            return res.status(400).json({ error: 'Invalid or inactive package' });
        }

        // Create the booking
        const booking = await Booking.create({
            customer_id,
            package_id,
            lead_id,
            travel_start_date,
            travel_end_date,
            num_travelers,
            status: 'confirmed', // use lowercase to match your schema enum
            booking_date: new Date(),
            special_requirements
        });

        // Update lead status
        lead.status = 'converted'; // again, lowercase to match enum/status values
        await lead.save();

        // Add optional services if provided
        if (services && services.length > 0) {
            for (const service of services) {
                await BookingService.create({
                    booking_id: booking._id, // Mongoose _id instead of booking_id
                    service_id: service.service_id,
                    price_applied: service.price
                });
            }
        }

        // Create initial invoice
        const invoice = await Invoice.create({
            booking_id: booking._id,
            amount: tourPackage.base_price,
            invoice_date: new Date(),
            status: 'sent'
        });

        // Log communication
        const communication=await CommunicationLog.create({
            customer_id,
            staff_id: req.user._id,
            log_date: new Date(),
            type: 'email', // or 'booking_confirmation' if added to schema
            content: `Booking #${booking._id} created for ${tourPackage.title} package`,
            status: 'completed'
        });

        res.status(201).json({
            booking,
            invoice,
            communication
            
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all bookings
 * @route   GET /api/bookings
 * @access  Private (Admin, Sales Agent, Operation Team)
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const filter = {};

    // If user is a Sales Agent, restrict bookings to their leads only
    if (req.user.role_name === 'Sales Agent') {
      // Get all lead IDs created by this sales agent
      const leads = await Lead.find({ staff_id: req.user._id }).select('role_id');
      const leadIds = leads.map((lead) => lead._id);

      // Filter bookings based on those leads
      filter.lead_id = { $in: leadIds };
    }

    const bookings = await Booking.find(filter)
      .populate('lead_id', 'name email phone')
      .populate('customer_id', 'name email phone is_vip')
      .populate('package_id', 'title duration_days')
      .populate('guide_id', 'name phone')
      .populate('transport_id', 'name type')
      .sort({ booking_date: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};
/**
 * @desc    Get single booking with all details
 * @route   GET /api/bookings/:id
 * @access  Private (Admin, Sales Agent, Operation Team)
 */
export const getBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.id.trim(); // Clean ID

        const booking = await Booking.findById(bookingId)
            .populate('lead_id')
            .populate('customer_id')
            .populate({
                path: 'package_id',
                populate: {
                    path: 'packageItineraries' // now this works due to virtual
                }
            })
            .populate('guide_id')
            .populate('transport_id');
            // Uncomment these only if those fields exist in your Booking schema
            // .populate({
            //     path: 'bookingServices',
            //     populate: { path: 'optionalService' }
            // })
            // .populate('document')
            // .populate('payment')
            // .populate('invoice');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Authorization check - only the assigned Sales Agent can access
        if (req.user.role_name === 'Sales Agent') {
            const lead = await Lead.findById(booking.lead_id);
            if (!lead || lead.staff_id.toString() !== req.user.staff_id.toString()) {
                return res.status(403).json({ error: 'Unauthorized to access this booking' });
            }
        }

        res.json(booking);
    } catch (error) {
        next(error);
    }
};



/**
 * @desc    Update booking details
 * @route   PUT /api/bookings/:id
 * @access  Private (Admin, Sales Agent, Operation Team)
 */
export const updateBooking = async (req, res, next) => {
    try {
        const { guide_id, transport_id, status, travel_start_date, travel_end_date, num_travelers } = req.body;

        const bookingId = req.params.id.trim(); // Clean ID
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Authorization check
        if (req.user.role_name === 'Sales Agent') {
            const lead = await Lead.findById(booking.lead_id);
            if (!lead || lead.staff_id.toString() !== req.user.staff_id.toString()) {
                return res.status(403).json({ error: 'Unauthorized to update this booking' });
            }
        }

        // Operation team can only update guide and transport assignments
        if (req.user.role_name === 'Operation Team') {
            const updates = {};
            if (guide_id) updates.guide_id = guide_id;
            if (transport_id) updates.transport_id = transport_id;
            if (status) updates.status = status.toLowerCase(); // ✅ Normalize to lowercase

            Object.assign(booking, updates);
            await booking.save();

            await CommunicationLog.create({
                booking_id: booking._id,
                staff_id: req.user.staff_id,
                log_date: new Date(),
                type: 'Booking Update',
                content: `Operation team updated booking details (guide/transport/status)`,
                status: 'Completed'
            });

            return res.json(booking);
        }

        // Sales agents and admins can update other fields
        const updates = {
            guide_id,
            transport_id,
            status: status?.toLowerCase(), // ✅ Normalize to lowercase
            travel_start_date,
            travel_end_date,
            num_travelers
        };

        Object.assign(booking, updates);
        await booking.save();

        res.json(booking);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Assign guide to booking
 * @route   PUT /api/bookings/:id/assign-guide
 * @access  Private (Operation Team, Admin)
 */
export const assignGuide = async (req, res, next) => {
  try {
    const { guide_id } = req.body;

    // 1. Find the booking by ID
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // 2. Find the guide
    const guide = await Guide.findById(guide_id);

    // 3. Validate guide existence
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    // 4. Check if guide is active (strict false check)
    if (guide.is_active === false) {
      return res.status(400).json({ error: 'Guide is inactive and cannot be assigned' });
    }

    // 5. Assign the guide to the booking
    booking.guide_id = guide_id;
    await booking.save();

    // 6. Log the assignment
    // await CommunicationLog.create({
    //   booking_id: booking._id,
    //   staff_id: req.user._id,
    //   log_date: new Date(),
    //   type: 'other', // must match allowed enum in CommunicationLog
    //   content: `Assigned guide ${guide.name} to booking`,
    //   status: 'completed'
    // });

    // 7. Send response
    res.json({ message: 'Guide assigned successfully', booking });

  } catch (error) {
    console.error('Assign guide error:', error);
    next(error);
  }
};



/**
 * @desc    Assign transport to booking
 * @route   PUT /api/bookings/:id/assign-transport
 * @access  Private (Operation Team, Admin)
 */
export const assignTransport = async (req, res, next) => {
  try {
    const { transport_id } = req.body;

    // Find booking by ID
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Find transport and check if active
    const transport = await Transport.findById(transport_id);
    if (!transport || !transport.is_active) {
      return res.status(400).json({ error: 'Invalid or inactive transport' });
    }

    // Assign transport and save
    booking.transport_id = transport_id;
    await booking.save();

    // Log the assignment
    // await CommunicationLog.create({
    //   booking_id: booking._id,
    //   staff_id: req.user._id, // assuming populated in protect middleware
    //   log_date: new Date(),
    //   type: 'other', // because 'Transport Assignment' is not in enum
    //   content: `Assigned transport ${transport.name} (${transport.type}) to booking`,
    //   status: 'completed'
    // });

    res.json({ message: 'Transport assigned successfully', booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update booking status
 * @route   PUT /api/bookings/:id/status
 * @access  Private (Admin, Sales Agent, Operation Team)
 */
export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'pending', 'cancelled', 'completed'];

    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Find the booking by ID
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Authorization check for Sales Agent
    if (req.user.role_name === 'Sales Agent') {
      const lead = await Lead.findById(booking.lead_id);
      if (!lead || String(lead.staff_id) !== String(req.user._id)) {
        return res.status(403).json({ error: 'Unauthorized to update this booking' });
      }
    }

    // Update the booking status
    booking.status = status.toLowerCase();
    await booking.save();

    // Log the status change
    await CommunicationLog.create({
      booking_id: booking._id,
      staff_id: req.user._id,
      log_date: new Date(),
      type: 'other', // update if you later extend enum to include 'Status Update'
      content: `Booking status changed to ${status}`,
      status: 'completed'
    });

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Generate booking documents PDF
 * @route   GET /api/bookings/:id/generate-pdf
 * @access  Private (Admin, Sales Agent)
 */
export const generateBookingPDF = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer_id')
      .populate('package_id')
      .populate('guide_id')
      .populate('transport_id')
      .populate({
        path: 'lead_id',
        select: 'staff_id'
      });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const invoice = await Invoice.findOne({ booking_id: booking._id });
    const bookingServices = await BookingService.find({ booking_id: booking._id }).populate('service_id');

    // Authorization check for Sales Agent
    if (req.user.role_name === 'Sales Agent') {
      if (!booking.lead_id || booking.lead_id.staff_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized to access this booking' });
      }
    }

    // ✅ Construct data object matching what your PDF helper expects
    const pdfData = {
      booking: {
        _id: booking._id,
        customer_id: booking.customer_id,
        package_id: booking.package_id,
        guide_id: booking.guide_id,
        transport_id: booking.transport_id,
        travel_start_date: booking.travel_start_date,
        travel_end_date: booking.travel_end_date,
        num_travelers: booking.num_travelers,
        special_requirements: booking.special_requirements,
        status: booking.status
      },
      services: bookingServices.map(bs => ({
        service_id: bs.service_id,
        price_applied: bs.price_applied
      })),
      invoice: invoice
    };

    // 🧠 Optional: Log to verify data
    console.log("PDF Data:\n", JSON.stringify(pdfData, null, 2));

    // ✅ Generate PDF buffer
    const pdfBuffer = await generateBookingPDFHelper(pdfData);

    // ✅ Send as downloadable PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=booking_${booking._id}.pdf`
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    next(error);
  }
};

