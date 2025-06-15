import Invoice from '../models/Invoice.js';
import { generateInvoicePDF } from '../services/pdfService.js';
import { NotFoundError, ValidationError } from '../utils/validators.js';
import { sendInvoiceEmail, sendPaymentConfirmationEmail, sendCancellationEmail } from '../services/emailService.js';
import { logError } from '../utils/logger.js';
import BookingService from '../models/BookingService.js';

export const getInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find()
            .populate({
                path: 'booking_id',
                populate: {
                    path: 'customer_id',
                    select: 'name email phone'
                }
            })
            .sort({ createdAt: -1 });
            
        res.json(invoices);
    } catch (error) {
        next(error);
    }
};

export const getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate({
                path: 'booking_id',
                populate: [
                    { path: 'customer_id', select: 'name email phone' },
                    { path: 'package_id', select: 'title base_price' },
                    { path: 'guide_id', select: 'name email phone' },
                    { path: 'transport_id', select: 'vehicle_type driver_name driver_phone' }
                ]
            });

        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        res.json(invoice);
    } catch (error) {
        next(error);
    }
};

export const updateInvoiceStatus = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) throw new NotFoundError('Invoice not found');

        const { status } = req.body;
        if (!status) throw new ValidationError('Status is required');

        const originalStatus = invoice.status;
        if (originalStatus === status) return res.json(invoice);

        const shouldSendInvoiceEmail = status === 'sent';
        const shouldSendPaymentEmail = status === 'paid';
        const shouldSendCancellationEmail = status === 'cancelled';

        invoice.status = status;
        await invoice.save();

        const updatedInvoice = await Invoice.findById(invoice._id)
            .populate({
                path: 'booking_id',
                populate: { path: 'customer_id', select: 'name email phone' }
            });

        res.json(updatedInvoice);

        if (shouldSendInvoiceEmail) {
            sendInvoiceEmail(req.params.id)
                .catch(err => {
                    logError('Error sending invoice email:', err);
                });
        } else if (shouldSendPaymentEmail) {
            sendPaymentConfirmationEmail(req.params.id)
                .catch(err => {
                    logError('Error sending payment confirmation email:', err);
                });
        } else if (shouldSendCancellationEmail) {
            sendCancellationEmail(req.params.id)
                .catch(err => {
                    logError('Error sending cancellation email:', err);
                });
        }
    } catch (error) {
        next(error);
    }
};

export const downloadInvoicePDF = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate({
                path: 'booking_id',
                populate: [
                    { path: 'customer_id', select: 'name email phone' },
                    { path: 'package_id', select: 'title base_price duration_days inclusions exclusions' },
                    { path: 'guide_id', select: 'name phone' },
                    { path: 'transport_id', select: 'name type' }
                ]
            });

        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        // Get optional services for this booking
        const bookingServices = await BookingService.find({ 
            booking_id: invoice.booking_id._id 
        }).populate('service_id');

        // Transform the data to match what generateInvoicePDF expects
        const pdfData = {
            ...invoice.toObject(),
            booking_id: {
                ...invoice.booking_id.toObject(),
                customer_id: invoice.booking_id?.customer_id,
                package_id: {
                    ...invoice.booking_id?.package_id?.toObject(),
                    inclusions: invoice.booking_id?.package_id?.inclusions || {},
                    exclusions: invoice.booking_id?.package_id?.exclusions || {}
                },
                guide_id: invoice.booking_id?.guide_id || null,
                transport_id: invoice.booking_id?.transport_id || null,
                package_type: invoice.booking_id?.package_type || 'Deluxe' // Make sure package_type is included
            },
            services: bookingServices.map(bs => ({
                service_id: bs.service_id,
                price_applied: bs.price_applied
            }))
        };

        const pdfBuffer = await generateInvoicePDF(pdfData);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice._id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};