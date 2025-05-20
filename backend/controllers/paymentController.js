import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';

// Create a new payment
export const createPayment = async (req, res) => {
    try {
        const { booking_id, amount, payment_date, payment_method, transaction_id, notes } = req.body;

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
            status: 'completed'
        });

        await payment.save();

        // Update invoice status
        await updateInvoiceStatus(booking_id);

        res.status(201).json(payment);
    } catch (error) {
        console.error('Payment creation error:', error);
        res.status(500).json({ 
            error: error.message,
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