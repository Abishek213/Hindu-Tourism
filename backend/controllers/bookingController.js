
import Booking from '../models/Booking.js';
import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';
import Package from '../models/Package.js';
import BookingService from '../models/BookingService.js';
import Invoice from '../models/Invoice.js';
import { generateBookingPDF as generateBookingPDFHelper } from '../services/pdfService.js';

export const createBooking = async (req, res, next) => {
    try {
      console.log("Raw request body:", req.body);
        const {
            customer_id, 
            package_id, 
            travel_start_date, 
            travel_end_date,
            num_travelers, 
            special_requirements, 
            services,
            destination
        } = req.body;

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

        // Validate that the selected destination is available in the package
        if ( !tourPackage.destination.includes(destination)) {
            return res.status(400).json({ 
                error: 'Selected destination is not available for this package',
                availableDestinations: tourPackage.destination
            });
        }

        // Create the booking with destination
        const booking = await Booking.create({
            customer_id,
            package_id,
            destination, // Include destination in the booking
            travel_start_date,
            travel_end_date,
            num_travelers,
            status: 'confirmed',
            booking_date: new Date(),
            special_requirements
        });

        // Add optional services if provided
        if (services && services.length > 0) {
            for (const service of services) {
                await BookingService.create({
                    booking_id: booking._id,
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

        res.status(201).json({
            booking,
            invoice
        });

    } catch (error) {
        next(error);
    }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role_name === 'Sales Agent') {
      const leads = await Lead.find({ staff_id: req.user._id }).select('role_id');
      const leadIds = leads.map((lead) => lead._id);

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

export const getBooking = async (req, res, next) => {
    try {
        const bookingId = req.params.id.trim(); // Clean ID

        const booking = await Booking.findById(bookingId)
            .populate('lead_id')
            .populate('customer_id')
            .populate({
                path: 'package_id',
                populate: {
                    path: 'packageItineraries' 
                }
            })
            .populate('guide_id')
            .populate('transport_id');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

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

export const updateBooking = async (req, res, next) => {
    try {
        const { guide_id, transport_id, status, travel_start_date, travel_end_date, num_travelers, travelStatus } = req.body;

        const bookingId = req.params.id.trim(); 
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        if (req.user.role_name === 'Sales Agent') {
            const lead = await Lead.findById(booking.lead_id);
            if (!lead || lead.staff_id.toString() !== req.user.staff_id.toString()) {
                return res.status(403).json({ error: 'Unauthorized to update this booking' });
            }
        }

        if (req.user.role_name === 'Operation Team') {
            const updates = {};
            if (guide_id) updates.guide_id = guide_id;
            if (transport_id) updates.transport_id = transport_id;
            if (status) updates.status = status.toLowerCase();

            Object.assign(booking, updates);
            await booking.save();
            return res.json(booking);
        }

        const updates = {
            guide_id,
            transport_id,
            status: status?.toLowerCase(), 
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

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // Find the booking by ID
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (req.user.role_name === 'Sales Agent') {
      const lead = await Lead.findById(booking.lead_id);
      if (!lead || String(lead.staff_id) !== String(req.user._id)) {
        return res.status(403).json({ error: 'Unauthorized to update this booking' });
      }
    }

    booking.status = status.toLowerCase();
    await booking.save();

    res.json({ message: 'Booking status updated', booking });
  } catch (error) {
    next(error);
  }
};

export const updateTravelStatus = async (req, res, next) => {
  try {
    const { travelStatus } = req.body;
    const bookingId = req.params.id.trim();
    
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (req.user.role_name === 'Sales Agent') {
      const lead = await Lead.findById(booking.lead_id);
      if (!lead || String(lead.staff_id) !== String(req.user._id)) {
        return res.status(403).json({ error: 'Unauthorized to update this booking' });
      }
    }

    booking.travelStatus = travelStatus;

    if (travelStatus.toLowerCase() === 'cancelled') {
      booking.status = 'cancelled';
    }
    
    await booking.save();

    res.json({ message: 'Travel status updated', booking });
  } catch (error) {
    next(error);
  }
};

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

    if (req.user.role_name === 'Sales Agent') {
      if (!booking.lead_id || booking.lead_id.staff_id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized to access this booking' });
      }
    }

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

    console.log("PDF Data:\n", JSON.stringify(pdfData, null, 2));

    const pdfBuffer = await generateBookingPDFHelper(pdfData);

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

