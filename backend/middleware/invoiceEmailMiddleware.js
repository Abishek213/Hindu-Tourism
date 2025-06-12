import { sendInvoiceEmail } from '../services/emailService.js';
import Invoice from '../models/Invoice.js';

/**
 * Middleware to send email when invoice status changes to 'sent'
 */
export const handleInvoiceEmail = async (req, res, next) => {
  try {
    const invoiceId = req.params.id;
    const { status } = req.body;

    // Only proceed if status is being updated to 'sent'
    if (status !== 'sent') {
      return next();
    }

    // Get the current invoice
    const invoice = await Invoice.findById(invoiceId)
      .populate({
        path: 'booking_id',
        populate: {
          path: 'customer_id',
          select: 'name email'
        }
      });

    if (!invoice) {
      console.error('Invoice not found for email sending');
      return next();
    }

    // Send the email
    const emailResult = await sendInvoiceEmail(invoiceId);

    if (!emailResult.success) {
      console.error('Failed to send invoice email:', emailResult.error);
      // Don't fail the request, just log the error
    }

    next();
  } catch (error) {
    console.error('Error in invoice email middleware:', error);
    // Continue with the request even if email fails
    next();
  }
};