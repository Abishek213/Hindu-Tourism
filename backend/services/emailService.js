import nodemailer from 'nodemailer';
import { generateInvoicePDF } from './pdfService.js';
import Invoice from '../models/Invoice.js';
import Booking from '../models/Booking.js';
import Customer from '../models/Customer.js';

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send invoice email to customer
 * @param {string} invoiceId - MongoDB invoice ID
 * @returns {Promise<boolean>} - Returns true if email was sent successfully
 */
export const sendInvoiceEmail = async (invoiceId) => {
  try {
    // Get complete invoice data with populated relationships
    const invoice = await Invoice.findById(invoiceId)
      .populate({
        path: 'booking_id',
        populate: [
          {
            path: 'customer_id',
            select: 'name email phone'
          },
          {
            path: 'package_id',
            select: 'title duration_days'
          }
        ]
      });

    if (!invoice) {
      console.error('Invoice not found');
      return false;
    }

    const customer = invoice.booking_id.customer_id;
    const booking = invoice.booking_id;
    const tourPackage = invoice.booking_id.package_id;

    // Generate PDF buffer
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Email content
    const mailOptions = {
      from: `"The Hindu Tourism" <${process.env.EMAIL_FROM || 'bookings@thehindutourism.com'}>`,
      to: customer.email,
      subject: `Your Tour Invoice #${invoice._id.toString().slice(-6)}`,
      text: `Dear ${customer.name},\n\nPlease find attached your invoice for ${tourPackage.title} tour.\n\nAmount Due: ${invoice.amount - (invoice.paid_amount || 0)}\nDue Date: ${invoice.due_date.toLocaleDateString()}\n\nThank you for choosing The Hindu Tourism!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3748;">Invoice for ${tourPackage.title} Tour</h2>
          <p>Dear ${customer.name},</p>
          <p>Please find attached your invoice for booking reference <strong>${booking._id.toString().slice(-6)}</strong>.</p>
          
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Invoice Number:</strong> ${invoice._id.toString().slice(-6)}</p>
            <p><strong>Total Amount:</strong> ₹${invoice.amount.toLocaleString()}</p>
            <p><strong>Paid Amount:</strong> ₹${(invoice.paid_amount || 0).toLocaleString()}</p>
            <p><strong>Amount Due:</strong> ₹${(invoice.amount - (invoice.paid_amount || 0)).toLocaleString()}</p>
            <p><strong>Due Date:</strong> ${invoice.due_date.toLocaleDateString()}</p>
          </div>

          ${process.env.PAYMENT_PORTAL_URL ? `
          <p style="margin-top: 24px;">
            <a href="${process.env.PAYMENT_PORTAL_URL}/pay/${invoice._id}" 
               style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Pay Online Now
            </a>
          </p>
          ` : ''}

          <p style="margin-top: 24px;">For any questions, please contact our support team.</p>
          <p>Thank you for choosing The Hindu Tourism!</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${invoice._id.toString().slice(-6)}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Invoice email sent:', info.messageId);
    
    // Update invoice status if needed
    if (invoice.status === 'draft') {
      invoice.status = 'sent';
      await invoice.save();
    }

    return true;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return false;
  }
};

/**
 * Test email service connection
 * @returns {Promise<boolean>}
 */
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('Server is ready to take our messages');
    return true;
  } catch (error) {
    console.error('Email connection error:', error);
    return false;
  }
};