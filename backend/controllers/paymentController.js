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

export const getPaymentSummaryByBookingId = async (req, res) => {
    try {
        const { booking_id } = req.params;

        // 1. Find the booking to get package_id
        const booking = await Booking.findById(booking_id).populate('package_id');

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // 2. Get total package amount from the associated package
        const total_amount = booking.package_id ? booking.package_id.base_price : 0;

        // 3. Get all completed payments for this booking
        const payments = await Payment.find({ booking_id, status: 'completed' });

        // 4. Calculate total paid amount
        const total_paid_amount = payments.reduce((sum, payment) => sum + payment.amount, 0);

        // 5. Calculate due amount
        const due_amount = total_amount - total_paid_amount;

        res.json({
            booking_id: booking._id,
            total_amount,
            total_paid_amount,
            due_amount,
            payments_count: payments.length // Optional: number of completed payments
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

        // Update invoice status
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

        // Update invoice status if amount or status changes
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

// Helper function to update invoice status
const updateInvoiceStatus = async (booking_id) => {
    const invoice = await Invoice.findOne({ booking_id });
    if (!invoice) return;

    const payments = await Payment.find({ 
        booking_id, 
        status: 'completed' 
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

    if (totalPaid >= invoice.amount) {
        invoice.status = 'paid';
    } else if (totalPaid > 0) {
        invoice.status = 'partial';
    } else {
        invoice.status = 'pending';
    }

    await invoice.save();
};