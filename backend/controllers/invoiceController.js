import Invoice from '../models/Invoice.js';
import Booking from '../models/Booking.js';
import { generateInvoicePDF as generatePDF } from '../services/pdfService.js';
import { NotFoundError, ValidationError } from '../utils/validators.js';

export const createInvoice = async (req, res, next) => {
    try {
        const { booking_id, amount } = req.body;
        
        // Verify booking exists
        const booking = await Booking.findById(booking_id);
        if (!booking) {
            throw new NotFoundError('Booking not found');
        }

        const newInvoice = new Invoice({
            booking_id,
            amount,
            status: 'draft'
        });

        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        next(error);
    }
};

export const getInvoices = async (req, res, next) => {
    try {
        const { status, booking_id } = req.query;
        const filters = {};
        
        if (status) filters.status = status;
        if (booking_id) filters.booking_id = booking_id;

        const invoices = await Invoice.find(filters)
            .populate('booking_id', 'booking_date travel_start_date num_travelers')
            .sort({ invoice_date: -1 });

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
                populate: {
                    path: 'customer_id',
                    select: 'name email phone'
                }
            });

        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }
        res.json(invoice);
    } catch (error) {
        next(error);
    }
};

export const updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        // Validate status transitions
        if (req.body.status) {
            const validTransitions = {
                draft: ['sent', 'cancelled'],
                sent: ['paid', 'cancelled'],
                paid: [],
                cancelled: []
            };

            if (!validTransitions[invoice.status].includes(req.body.status)) {
                throw new ValidationError(`Invalid status transition from ${invoice.status} to ${req.body.status}`);
            }
        }

        // Only allow amount update for draft invoices
        if (req.body.amount && invoice.status !== 'draft') {
            throw new ValidationError('Cannot update amount for non-draft invoices');
        }

        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedInvoice);
    } catch (error) {
        next(error);
    }
};

export const deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        if (invoice.status !== 'draft') {
            throw new ValidationError('Only draft invoices can be deleted');
        }

        await Invoice.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const downloadInvoicePDF = async (req, res, next) => { 
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate({
        path: 'booking_id',
        // Explicitly populate nested relationships
        populate: [
          {
            path: 'customer_id',
            select: 'name email phone'
          },
          {
            path: 'package_id',
            select: 'title base_price inclusions exclusions' // Add inclusions/exclusions
          }
        ]
      });

        if (!invoice) {
            throw new NotFoundError('Invoice not found');
        }

        // Add validation for critical data
    if (!invoice.booking_id?.package_id) {
      throw new ValidationError('Package data missing from invoice');
    }

        const pdfBuffer = await generatePDF(invoice); // Use the renamed import here
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice._id}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        next(error);
    }
};