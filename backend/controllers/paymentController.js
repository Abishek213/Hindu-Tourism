import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Invoice from '../models/Invoice.js';

// Create a new payment
export const createPayment = async (req, res) => {
    try {
        const { booking_id, amount, payment_date, payment_method, transaction_id, notes, status } = req.body;

        // Validate required fields
        if (!booking_id || !amount || !payment_date || !payment_method) {
            return res.status(400).json({
                error: "Missing required fields: booking_id, amount, payment_date, payment_method"
            });
        }

        // Check if booking exists
        const booking = await Booking.findById(booking_id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Create payment
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

        // Only update invoice if payment status is 'completed' or 'advance'
        if (['completed', 'advance'].includes(payment.status)) {
            await updateInvoiceStatus(booking_id);
        }

        // Populate booking_id for the response
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
            .sort({ payment_date: -1 });

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

        const paymentIds = payments.map(p => p.latestPayment._id);

        const populated = await Payment.find({ _id: { $in: paymentIds } })
            .populate({
                path: 'booking_id',
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

        const payments = await Payment.find({ booking_id, status: { $in: ['completed', 'advance'] } });
        const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const packageAmount = booking.package_id.base_price;
        const newTotalPaid = totalPaid + parseFloat(amount);

        let overallStatus = 'pending';
        if (newTotalPaid >= packageAmount) {
            overallStatus = 'completed';
        } else if (newTotalPaid > 0) {
            overallStatus = 'advance';
        }

        const newPayment = await Payment.create({
            booking_id,
            amount: parseFloat(amount),
            payment_method,
            transaction_id: transaction_id || null,
            notes: notes || null,
            status: status || 'pending',
            payment_date: new Date()
        });

        await Booking.findByIdAndUpdate(booking_id, {
            overallPaymentStatus: overallStatus
        });

        // Only update invoice if payment status is 'completed' or 'advance'
        if (['completed', 'advance'].includes(status)) {
            await updateInvoiceStatus(booking_id);
        }

        const populatedPayment = await Payment.findById(newPayment._id)
            .populate({
                path: 'booking_id',
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

export const getPaymentsByBooking = async (req, res) => {
    try {
        const { booking_id } = req.params;
        const payments = await Payment.find({ booking_id })
            .sort({ payment_date: -1 });
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
        const payments = await Payment.find({ booking_id, status: { $in: ['completed', 'advance'] } });
        const total_paid_amount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const due_amount = Math.max(0, total_amount - total_paid_amount);

        res.json({
            booking_id: booking._id,
            total_amount,
            total_paid_amount,
            due_amount,
            payments_count: payments.length,
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

export const updatePaymentStatus = async (req, res) => {
    try {
        const { payment_id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }

        const currentPayment = await Payment.findById(payment_id);
        if (!currentPayment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (currentPayment.status === status) {
            return res.json(currentPayment);
        }

        const payment = await Payment.findByIdAndUpdate(
            payment_id,
            { status },
            { new: true }
        );

        await recalculateBookingOverallStatus(payment.booking_id);
        
        if (['completed', 'advance'].includes(status)) {
            await updateInvoiceStatus(payment.booking_id);
        }

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

        if (status && ['completed', 'advance'].includes(status)) {
            await updateInvoiceStatus(payment.booking_id);
        }

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
        status: { $in: ['completed', 'advance'] }
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const originalStatus = invoice.status;

    let newStatus = originalStatus;
    if (totalPaid >= invoice.amount) {
        newStatus = 'paid';
    } else if (totalPaid > 0) {
        newStatus = 'sent';
    } else {
        newStatus = 'draft';
    }

    if (newStatus !== originalStatus) {
        invoice.status = newStatus;
        await invoice.save();
    }
};

// Helper function to recalculate and update the booking's overallPaymentStatus
const recalculateBookingOverallStatus = async (booking_id) => {
    const booking = await Booking.findById(booking_id).populate('package_id');
    if (!booking) return;

    const total_amount = booking.package_id ? booking.package_id.base_price : 0;
    const payments = await Payment.find({ booking_id, status: { $in: ['completed', 'advance'] } });
    const total_paid_amount = payments.reduce((sum, payment) => sum + payment.amount, 0);

    let newOverallStatus = 'pending';
    if (total_paid_amount >= total_amount) {
        newOverallStatus = 'completed';
    } else if (total_paid_amount > 0) {
        newOverallStatus = 'advance';
    }

    if (booking.overallPaymentStatus !== newOverallStatus) {
        booking.overallPaymentStatus = newOverallStatus;
        await booking.save();
    }
};