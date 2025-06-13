import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';
import Package from '../models/Package.js';

// Create a new payment
export const createPayment = async (req, res) => {
    try {
        // Add 'status' to destructuring to allow frontend to send it
        const { booking_id, amount, payment_date, payment_method, transaction_id, notes, status } = req.body;

        // Validate required fields
        if (!booking_id || !amount || !payment_date || !payment_method) {
            return res.status(400).json({
                error: "Missing required fields: booking_id, amount, payment_date, payment_method"
            });
        }

        // Check if booking exists (Mongoose)
        const booking = await Booking.findById(booking_id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Create payment (Mongoose)
        const payment = new Payment({
            booking_id,
            amount,
            payment_date,
            payment_method,
            transaction_id: transaction_id || null,
            notes: notes || null,
            status: status || 'pending'
        });

        await payment.save();

        // Update invoice status
        await updateInvoiceStatus(booking_id);

        // Populate booking_id for the response, so frontend can immediately show customer details
        const populatedPayment = await Payment.findById(payment._id).populate({
            path: 'booking_id',
            select: 'customer_name booking_ref_id'
        });

        res.status(201).json(populatedPayment);
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find({})
            .populate({
                path: 'booking_id',
                select: 'customer_id package_id booking_ref_id',
                populate: [
                    {
                        path: 'customer_id',
                        select: 'name email phone'
                    },
                    {
                        path: 'package_id',
                        select: 'title base_price'
                    }
                ]
            })
            .sort({ payment_date: -1 }); // Sort by most recent payment

        res.json(payments);
    } catch (error) {
        console.error('Error fetching all payments:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getLatestPaymentsPerBooking = async (req, res) => {
  try {
    const payments = await Payment.aggregate([
      {
        $sort: { payment_date: -1 }
      },
      {
        $group: {
          _id: "$booking_id",
          latestPayment: { $first: "$$ROOT" }
        }
      }
    ]);

    // Extract latest payment IDs
    const paymentIds = payments.map(p => p.latestPayment._id);

    // Fetch full payment docs with population
    const populated = await Payment.find({ _id: { $in: paymentIds } })
      .populate({
        path: 'booking_id',
        // Important: Populate customer and package for the main table
        // We will fetch payment summary separately for overlay
        populate: [
          { path: 'customer_id', select: 'name email phone' },
          { path: 'package_id', select: 'title base_price' }
        ]
      });

    res.json(populated);
  } catch (error) {
    console.error('Error in getLatestPaymentsPerBooking:', error);
    res.status(500).json({ error: error.message });
  }
};


export const recordPayment = async (req, res, next) => {
  try {
    const { booking_id, amount, payment_method, transaction_id, notes, status } = req.body;

    // Validate required fields
    if (!booking_id || !amount || !payment_method) {
      return res.status(400).json({ error: 'Booking ID, amount, and payment method are required.' });
    }

    // Validate amount is a positive number
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const booking = await Booking.findById(booking_id).populate('package_id');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (!booking.package_id || !booking.package_id.base_price) {
        return res.status(400).json({ error: 'Package information (base_price) is missing for this booking.' });
    }

    // --- IMPORTANT CHANGE HERE: Include 'advance' payments in totalPaid calculation ---
    const payments = await Payment.find({ booking_id, status: { $in: ['completed', 'advance'] } });
    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const packageAmount = booking.package_id.base_price;
    const newTotalPaid = totalPaid + parseFloat(amount); // Add the new payment amount

    // Determine overall payment status based on new total paid
    let overallStatus = 'pending'; // Default
    if (newTotalPaid >= packageAmount) {
      overallStatus = 'completed';
    } else if (newTotalPaid > 0) {
      overallStatus = 'advance';
    }

    // Create the payment record with the status determined by the frontend logic
    // The frontend sends 'completed' or 'advance' based on `paymentAmount >= dueAmount`
    const newPayment = await Payment.create({
      booking_id,
      amount: parseFloat(amount),
      payment_method,
      transaction_id: transaction_id || null,
      notes: notes || null,
      status: status || 'pending', // Use the status sent from frontend, default to 'pending'
      payment_date: new Date()
    });

    // Then update the booking's overallPaymentStatus in the database
    await Booking.findByIdAndUpdate(booking_id, {
      overallPaymentStatus: overallStatus
    });

    // Update invoice status (this helper should also be adjusted if it only looks at 'completed')
    await updateInvoiceStatus(booking_id);

    // Return the payment with populated booking data for frontend confirmation
    const populatedPayment = await Payment.findById(newPayment._id)
      .populate({
        path: 'booking_id',
        // Populate customer and package info for the response
        populate: [
          { path: 'customer_id', select: 'name email phone' },
          { path: 'package_id', select: 'title base_price' }
        ]
      });

    res.status(201).json(populatedPayment);
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      error: 'Failed to record payment',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
// Get all payments for a booking
export const getPaymentsByBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;

        // Find payments (Mongoose)
        const payments = await Payment.find({ booking_id })
            .sort({ payment_date: -1 }); // Descending order

        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPaymentSummary = async (req, res) => {
  try {
    const { booking_id } = req.params;

    const booking = await Booking.findById(booking_id).populate('package_id');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const total_amount = booking.package_id ? booking.package_id.base_price : 0;
    // --- IMPORTANT CHANGE HERE: Include 'advance' payments in total_paid_amount calculation ---
    const payments = await Payment.find({ booking_id, status: { $in: ['completed', 'advance'] } });
    const total_paid_amount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const due_amount = Math.max(0, total_amount - total_paid_amount);

    res.json({
      booking_id: booking._id,
      total_amount,
      total_paid_amount,
      due_amount,
      payments_count: payments.length,
      // The overall_payment_status should ideally come from the booking document itself,
      // which is updated in recordPayment. This provides consistency.
      overall_payment_status: booking.overallPaymentStatus ||
                            (total_paid_amount >= total_amount ? 'completed' :
                             (total_paid_amount > 0 ? 'advance' : 'pending'))
    });
  } catch (error) {
    console.error('Error getting payment summary:', error);
    res.status(500).json({
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Update payment status
export const updatePaymentStatus = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const { status } = req.body;

        // Validate status in request body
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        // Find and update payment (Mongoose)
        const payment = await Payment.findByIdAndUpdate(
            payment_id,
            { status },
            { new: true } // Return updated document
        );

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // After updating a payment's status, recalculate overall status for the booking
        await recalculateBookingOverallStatus(payment.booking_id);
        await updateInvoiceStatus(payment.booking_id);

        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updatePayment = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const { amount, payment_date, payment_method, transaction_id, notes, status } = req.body;

        const updatedFields = {};
        if (amount !== undefined) updatedFields.amount = amount;
        if (payment_date) updatedFields.payment_date = payment_date;
        if (payment_method) updatedFields.payment_method = payment_method;
        if (transaction_id !== undefined) updatedFields.transaction_id = transaction_id;
        if (notes !== undefined) updatedFields.notes = notes;
        if (status) updatedFields.status = status;


        const payment = await Payment.findByIdAndUpdate(
            payment_id,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // After updating a payment, recalculate overall status for the booking
        // await recalculateBookingOverallStatus(payment.booking_id);
        await updateInvoiceStatus(payment.booking_id);

        res.json(payment);
    } catch (error) {
        console.error('Payment update error:', error);
        res.status(500).json({
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Helper function to recalculate and update the booking's overallPaymentStatus
// const recalculateBookingOverallStatus = async (booking_id) => {
//     const booking = await Booking.findById(booking_id).populate('package_id');
//     if (!booking) return;

//     const total_amount = booking.package_id ? booking.package_id.base_price : 0;
//     // Include 'completed' and 'advance' payments for this calculation
//     const payments = await Payment.find({ booking_id, status: { $in: ['completed', 'advance'] } });
//     const total_paid_amount = payments.reduce((sum, payment) => sum + payment.amount, 0);

//     let newOverallStatus = 'pending';
//     if (total_paid_amount >= total_amount) {
//         newOverallStatus = 'completed';
//     } else if (total_paid_amount > 0) {
//         newOverallStatus = 'advance';
//     }

//     if (booking.overallPaymentStatus !== newOverallStatus) {
//         booking.overallPaymentStatus = newOverallStatus;
//         await booking.save();
//     }
// };


// Helper function to update invoice status
const updateInvoiceStatus = async (booking_id) => {
    const invoice = await Invoice.findOne({ booking_id });
    if (!invoice) return;

    // IMPORTANT: Invoice status should also consider 'advance' payments if they are part of "paid"
    const payments = await Payment.find({
        booking_id,
        status: { $in: ['completed', 'advance'] } // Include advance payments for invoice status
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    if (totalPaid >= invoice.amount) {
        invoice.status = 'paid';
    } else if (totalPaid > 0) {
        invoice.status = 'sent'; // Or 'partial_paid' if you have such a status
    } else {
        invoice.status = 'draft';
    }

    await invoice.save();
};
