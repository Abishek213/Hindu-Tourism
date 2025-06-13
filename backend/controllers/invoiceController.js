import Invoice from '../models/Invoice.js';
import { generateInvoicePDF } from '../services/pdfService.js';
import { NotFoundError, ValidationError } from '../utils/validators.js';
import { sendInvoiceEmail } from '../services/emailService.js';
import { logError } from '../utils/logger.js';

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

        // Prevent email sending if status is changing between non-draft states
        const shouldSendEmail = originalStatus === 'draft' && status === 'sent' && !invoice.emailSent;

        invoice.status = status;
        
        if (shouldSendEmail) {
            invoice.emailSent = true;
        }

        await invoice.save();

        const updatedInvoice = await Invoice.findById(invoice._id)
            .populate({
                path: 'booking_id',
                populate: { path: 'customer_id', select: 'name email phone' }
            });

        res.json(updatedInvoice);

        if (shouldSendEmail) {
            sendInvoiceEmail(req.params.id)
                .catch(err => {
                    logError('Error sending invoice email:', err);
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
                    { path: 'package_id', select: 'title base_price inclusions' }
                ]
            });

        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        const pdfBuffer = await generateInvoicePDF(invoice);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice._id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};