import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { generateInvoicePDF } from './pdfService.js';
import Invoice from '../models/Invoice.js';
import Booking from '../models/Booking.js';
import { logError, logInfo } from '../utils/logger.js';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASSWORD,
    user: 'thehindutourism@gmail.com',
    pass: 'gifj ciee soti lkpi'
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

/**
 * Verify email connection on startup
 */
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    logInfo('Email server connection verified');
    return true;
  } catch (error) {
    logError('Email connection failed:', error);
    return false;
  }
};

/**
 * Send booking confirmation email to customer
 * @param {string} bookingId - MongoDB booking ID
 * @returns {Promise<Object>} - Returns success status and details
 */
export const sendBookingConfirmationEmail = async (bookingId) => {
  const result = {
    success: false,
    bookingId,
    timestamp: new Date(),
    error: null,
    messageId: null
  };

  try {
    // Validate booking ID
    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error('Invalid booking ID');
    }

    // Get complete booking data
    const booking = await Booking.findById(bookingId)
      .populate('customer_id')
      .populate('package_id');

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Validate required data
    if (!booking.customer_id?.email) {
      throw new Error('Customer email is required');
    }

    const customer = booking.customer_id;
    const tourPackage = booking.package_id;

    // Generate booking reference
    const bookingReference = booking._id.toString().slice(-6).toUpperCase();
    const formattedStartDate = booking.travel_start_date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedEndDate = booking.travel_end_date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Email content
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'The Hindu Tourism'}" <${process.env.EMAIL_FROM || 'thehindutourism@gmail.com'}>`,
      to: customer.email,
      subject: `Your Booking Confirmation #${bookingReference}`,
      text: `Dear ${customer.name},\n\nYour booking for ${tourPackage.title} has been successfully confirmed!\n\nTravel Dates: ${formattedStartDate} to ${formattedEndDate}\nNumber of Travelers: ${booking.num_travelers}\nPackage Type: ${booking.package_type}\n\nThank you for choosing The Hindu Tourism!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2d3748;">Booking Confirmation #${bookingReference}</h2>
          <p>Dear ${customer.name},</p>
          <p>Thank you for booking with The Hindu Tourism! Your reservation for <strong>${tourPackage.title}</strong> has been confirmed.</p>
          
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #2d3748;">Booking Details</h3>
            <p><strong>Booking Reference:</strong> ${bookingReference}</p>
            <p><strong>Tour Package:</strong> ${tourPackage.title}</p>
            <p><strong>Travel Dates:</strong> ${formattedStartDate} to ${formattedEndDate}</p>
            <p><strong>Number of Travelers:</strong> ${booking.num_travelers}</p>
            <p><strong>Package Type:</strong> ${booking.package_type}</p>
            ${booking.special_requirements ? `<p><strong>Special Requirements:</strong> ${booking.special_requirements}</p>` : ''}
          </div>

          <p style="margin-top: 24px;">
            <strong>Next Steps:</strong><br>
            - You will receive a detailed itinerary within 24 hours<br>
            - Payment instructions will be sent separately if not already completed
          </p>

          <p style="margin-top: 24px; color: #4a5568;">
            For any questions, please contact our support team at 
            <a href="mailto:thehindutourism@gmail.com" style="color: #3182ce;">
              thehindutourism@gmail.com
            </a> or call us at +977-9803097747
          </p>
          
          <p style="margin-top: 24px; font-style: italic;">
            We look forward to serving you and creating wonderful travel memories!
          </p>
          
          <p style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
            <strong>The Hindu Tourism Team</strong><br>
            <a href="https://www.thehindutourism.com" style="color: #3182ce;">www.thehindutourism.com</a>
          </p>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    logInfo(`Booking confirmation email sent to ${customer.email}`, { messageId: info.messageId });

    // Update result
    result.success = true;
    result.messageId = info.messageId;
    result.customerEmail = customer.email;

    return result;

  } catch (error) {
    logError('Failed to send booking confirmation email:', {
      error: error.message,
      bookingId,
      stack: error.stack
    });
    
    result.error = error.message;
    return result;
  }
};

/**
 * Send invoice email to customer
 * @param {string} invoiceId - MongoDB invoice ID
 * @returns {Promise<Object>} - Returns success status and details
 */
export const sendInvoiceEmail = async (invoiceId) => {
  const result = {
    success: false,
    invoiceId,
    timestamp: new Date(),
    error: null,
    messageId: null
  };

  try {
    // Validate invoice ID
    if (!invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new Error('Invalid invoice ID');
    }

    // Get complete invoice data
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
            select: 'title duration_days base_price'
          }
        ]
      });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // Validate required data
    if (!invoice.booking_id?.customer_id?.email) {
      throw new Error('Customer email is required');
    }

    const customer = invoice.booking_id.customer_id;
    const booking = invoice.booking_id;
    const tourPackage = invoice.booking_id.package_id;

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Calculate dates and amounts
    const dueDate = invoice.due_date 
      ? invoice.due_date.toLocaleDateString() 
      : 'Not specified';
    const amountDue = invoice.amount - (invoice.paid_amount || 0);
    const invoiceNumber = invoice._id.toString().slice(-6).toUpperCase();
    const bookingReference = booking._id.toString().slice(-6).toUpperCase();

    // Email content
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'The Hindu Tourism'}" <${process.env.EMAIL_FROM || 'thehindutourism@gmail.com'}>`,
      to: customer.email,
      subject: `Your Tour Invoice #${invoiceNumber}`,
      text: `Dear ${customer.name},\n\nPlease find attached your invoice for ${tourPackage.title} tour.\n\nAmount Due: ₹${amountDue.toLocaleString()}\nDue Date: ${dueDate}\n\nThank you for choosing The Hindu Tourism!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2d3748;">Invoice for ${tourPackage.title} Tour</h2>
          <p>Dear ${customer.name},</p>
          <p>Please find attached your invoice for booking reference <strong>${bookingReference}</strong>.</p>
          
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e2e8f0;">
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Tour Package:</strong> ${tourPackage.title} (${tourPackage.duration_days} days)</p>
            <p><strong>Total Amount:</strong> ₹${invoice.amount.toLocaleString()}</p>
            <p><strong>Paid Amount:</strong> ₹${(invoice.paid_amount || 0).toLocaleString()}</p>
            <p><strong>Amount Due:</strong> ₹${amountDue.toLocaleString()}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>

          <p style="margin-top: 24px; color: #4a5568;">
            For any questions, please contact our support team at 
            <a href="mailto:support@thehindutourism.com" style="color: #3182ce;">
              support@thehindutourism.com
            </a>
          </p>
          <p>Thank you for choosing The Hindu Tourism!</p>
        </div>
      `,
      attachments: [
        {
          filename: `Invoice_${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    logInfo(`Invoice email sent to ${customer.email}`, { messageId: info.messageId });

    // Update result
    result.success = true;
    result.messageId = info.messageId;
    result.customerEmail = customer.email;

    // Update invoice status if needed
    if (invoice.status === 'draft') {
      invoice.status = 'sent';
      await invoice.save();
    }

    return result;

  } catch (error) {
    logError('Failed to send invoice email:', {
      error: error.message,
      invoiceId,
      stack: error.stack
    });
    
    result.error = error.message;
    return result;
  }
};

/**
 * Test email service connection
 * @returns {Promise<Object>} - Connection test result
 */
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    logInfo('Email service test successful');
    return { success: true, message: 'Email service is ready' };
  } catch (error) {
    logError('Email connection test failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: 'Check your email configuration and credentials'
    };
  }
};

/**
 * Send test email
 * @param {string} toEmail - Recipient email address
 * @returns {Promise<Object>} - Test email result
 */
export const sendTestEmail = async (toEmail) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Test Email'}" <${process.env.EMAIL_FROM || 'thehindutourism@gmail.com'}>`,
      to: toEmail,
      subject: 'Test Email from The Hindu Tourism',
      text: 'This is a test email from The Hindu Tourism backend service.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3748;">Test Email Successful</h2>
          <p>This email confirms that your email service is properly configured.</p>
          <p>Sent from The Hindu Tourism backend service.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return { 
      success: true, 
      message: 'Test email sent successfully',
      messageId: info.messageId 
    };
  } catch (error) {
    logError('Failed to send test email:', error);
    return { 
      success: false, 
      error: error.message,
      details: 'Check your email configuration'
    };
  }
};