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


export const sendInvoiceEmail = async (invoiceId) => {
  const result = {
    success: false,
    invoiceId,
    timestamp: new Date(),
    error: null,
    messageId: null
  };

  try {
    if (!invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new Error('Invalid invoice ID');
    }

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
          },
          {
            path: 'guide_id',
            select: 'name phone'
          },
          {
            path: 'transport_id',
            select: 'name type'
          }
        ]
      });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (!invoice.booking_id?.customer_id?.email) {
      throw new Error('Customer email is required');
    }

    const customer = invoice.booking_id.customer_id;
    const booking = invoice.booking_id;
    const tourPackage = invoice.booking_id.package_id;
    const guide = invoice.booking_id.guide_id || {};
    const transport = invoice.booking_id.transport_id || {};

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice);

    // Calculate dates and amounts
    const dueDate = invoice.due_date 
      ? invoice.due_date.toLocaleDateString() 
      : 'Not specified';
    const amountDue = invoice.amount - (invoice.paid_amount || 0);
    const invoiceNumber = invoice._id.toString().slice(-6).toUpperCase();
    const bookingReference = booking._id.toString().slice(-6).toUpperCase();

    // Build assigned services HTML
    let assignedServicesHtml = '';
    if (guide.name || transport.name) {
      assignedServicesHtml = `
        <div style="background: #f0fff4; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #c6f6d5;">
          <h3 style="margin-top: 0; color: #2d3748;">Assigned Services</h3>
          ${guide.name ? `<p><strong>Guide:</strong> ${guide.name} (${guide.phone || 'No phone'})</p>` : ''}
          ${transport.name ? `<p><strong>Transport:</strong> ${transport.name} (${transport.type || 'No type'})</p>` : ''}
        </div>
      `;
    }

    // Email content
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'The Hindu Tourism'}" <${process.env.EMAIL_FROM || 'thehindutourism@gmail.com'}>`,
      to: customer.email,
      subject: `Your Tour Invoice for Booking #${bookingReference}`,
      text: `Dear ${customer.name},\n\nPlease find attached your invoice for booking #${bookingReference} (${tourPackage.title}).\n\nAmount Due: ₹${amountDue.toLocaleString()}\nDue Date: ${dueDate}\n\nThank you for choosing The Hindu Tourism!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2d3748;">Invoice for Booking #${bookingReference}</h2>
          <p>Dear ${customer.name},</p>
          <p>Please find attached your invoice for booking reference <strong>#${bookingReference}</strong> (${tourPackage.title}).</p>
          
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #2d3748;">Invoice Details</h3>
            <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
            <p><strong>Booking Reference:</strong> #${bookingReference}</p>
            <p><strong>Tour Package:</strong> ${tourPackage.title} (${tourPackage.duration_days} days)</p>
            <p><strong>Total Amount:</strong> ₹${invoice.amount.toLocaleString()}</p>
            <p><strong>Paid Amount:</strong> ₹${(invoice.paid_amount || 0).toLocaleString()}</p>
            <p><strong>Amount Due:</strong> ₹${amountDue.toLocaleString()}</p>
            <p><strong>Due Date:</strong> ${dueDate}</p>
          </div>

          ${assignedServicesHtml}

          <p style="margin-top: 24px; color: #4a5568;">
            For any questions, please contact our support team at 
            <a href="mailto:thehindutourism@gmail.com" style="color: #3182ce;">
              thehindutourism@gmail.com
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


export const sendPaymentConfirmationEmail = async (invoiceId) => {
  const result = {
    success: false,
    invoiceId,
    timestamp: new Date(),
    error: null,
    messageId: null
  };

  try {
    if (!invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new Error('Invalid invoice ID');
    }

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
            select: 'title duration_days destinations'
          }
        ]
      });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (!invoice.booking_id?.customer_id?.email) {
      throw new Error('Customer email is required');
    }

    const customer = invoice.booking_id.customer_id;
    const booking = invoice.booking_id;
    const tourPackage = invoice.booking_id.package_id;
    const bookingReference = booking._id.toString().slice(-6).toUpperCase();
    const formattedStartDate = booking.travel_start_date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Email content
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'The Hindu Tourism'}" <${process.env.EMAIL_FROM || 'thehindutourism@gmail.com'}>`,
      to: customer.email,
      subject: `Payment Fully Received For Booking#${bookingReference}!`,
      text: `Dear ${customer.name},\n\nWe are delighted to inform you that your payment of ₹${invoice.amount.toLocaleString()} for booking #${bookingReference} (${tourPackage.title}) has been successfully processed.\n\nWe sincerely appreciate your trust in The Hindu Tourism. Your satisfaction is our top priority, and we can't wait to welcome you on this journey.\n\nAs a token of our appreciation, we'd like to offer you a special 10% discount on your next booking with us. Just mention reference #${bookingReference} when you book again.\n\nIf you have any questions or special requests, our support team is always here to help.\n\nWarm regards,\nThe Hindu Tourism Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #2d3748; margin-bottom: 8px;">Payment Confirmed!</h1>
            <p style="color: #4a5568; font-size: 18px;">Your adventure with The Hindu Tourism is secured</p>
          </div>

          <p>Dear ${customer.name},</p>
          <p>We are delighted to inform you that your payment of <strong>₹${invoice.amount.toLocaleString()}</strong> has been successfully processed.</p>
          
          <div style="background: #fffaf0; padding: 16px; border-radius: 8px; margin: 24px 0; border: 1px solid #feebc8; text-align: center;">
            <h3 style="margin-top: 0; color: #2d3748;">Our Special Thank You</h3>
            <p>As a token of our appreciation, enjoy <strong>10% OFF</strong> your next booking with us!</p>
            <p style="font-size: 24px; font-weight: bold; color: #dd6b20;">Use code: THANKS${bookingReference}</p>
            <p>Valid for 6 months from your travel date</p>
          </div>

          <p>We sincerely appreciate your trust in The Hindu Tourism. Your satisfaction is our top priority, and we can't wait to welcome you on this journey.</p>

          <p style="margin-top: 24px; color: #4a5568;">
            For any questions or special requests, contact our support team at 
            <a href="mailto:thehindutourism@gmail.com" style="color: #3182ce;">
              thehindutourism@gmail.com
            </a> or call +977-9803097747
          </p>
          
          <p style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 24px; text-align: center;">
            <strong style="font-size: 18px;">The Hindu Tourism Team</strong><br>
            <a href="https://www.thehindutourism.com" style="color: #3182ce; text-decoration: none;">www.thehindutourism.com</a>
          </p>
        </div>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    logInfo(`Payment confirmation email sent to ${customer.email}`, { messageId: info.messageId });

    // Update result
    result.success = true;
    result.messageId = info.messageId;
    result.customerEmail = customer.email;

    return result;

  } catch (error) {
    logError('Failed to send payment confirmation email:', {
      error: error.message,
      invoiceId,
      stack: error.stack
    });
    
    result.error = error.message;
    return result;
  }
};


export const sendCancellationEmail = async (invoiceId) => {
  const result = {
    success: false,
    invoiceId,
    timestamp: new Date(),
    error: null,
    messageId: null
  };

  try {
    if (!invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) {
      throw new Error('Invalid invoice ID');
    }

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
            select: 'title'
          }
        ]
      });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (!invoice.booking_id?.customer_id?.email) {
      throw new Error('Customer email is required');
    }

    const customer = invoice.booking_id.customer_id;
    const booking = invoice.booking_id;
    const tourPackage = invoice.booking_id.package_id;
    const bookingReference = booking._id.toString().slice(-6).toUpperCase();

    // Email content
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'The Hindu Tourism'}" <${process.env.EMAIL_FROM || 'thehindutourism@gmail.com'}>`,
      to: customer.email,
      subject: `Cancellation Confirmation for Booking #${bookingReference}`,
      text: `Dear ${customer.name},\n\nWe have processed your cancellation request for booking #${bookingReference} (${tourPackage.title}).\n\nWe're sorry to see you go! Could you share your reason for cancelling? This will help us improve our services.\n\nIf this was a mistake or you'd like to rebook, please contact us immediately.\n\nBest regards,\nThe Hindu Tourism Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #2d3748;">Cancellation Confirmation</h2>
          <p>Dear ${customer.name},</p>
          <p>We have processed your cancellation request for booking <strong>#${bookingReference}</strong> (${tourPackage.title}).</p>
          
          <div style="background: #fff5f5; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #fed7d7;">
            <h3 style="margin-top: 0; color: #2d3748;">Cancellation Details</h3>
            <p><strong>Booking Reference:</strong> #${bookingReference}</p>
            <p><strong>Tour Package:</strong> ${tourPackage.title}</p>
            <p><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <p>We're sorry to see you go! Could you take a moment to share why you cancelled?</p>
          
          <div style="margin: 24px 0; padding: 16px; background: #f7fafc; border-radius: 8px;">
            <p><strong>Reason for cancellation (optional):</strong></p>
            <ul style="list-style-type: none; padding-left: 0;">
              <li>◻ Found a better deal elsewhere</li>
              <li>◻ Changed my travel plans</li>
              <li>◻ Not satisfied with the package</li>
              <li>◻ Other (please specify)</li>
            </ul>
          </div>

          <p>If this was a mistake or you'd like to rebook, please contact us immediately.</p>

          <p style="margin-top: 24px; color: #4a5568;">
            Contact our support team at 
            <a href="mailto:thehindutourism@gmail.com" style="color: #3182ce;">
              thehindutourism@gmail.com
            </a> or call us at +977-9803097747
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
    logInfo(`Cancellation email sent to ${customer.email}`, { messageId: info.messageId });

    // Update result
    result.success = true;
    result.messageId = info.messageId;
    result.customerEmail = customer.email;

    return result;

  } catch (error) {
    logError('Failed to send cancellation email:', {
      error: error.message,
      invoiceId,
      stack: error.stack
    });
    
    result.error = error.message;
    return result;
  }
};

//   try {
//     await transporter.verify();
//     logInfo('Email service test successful');
//     return { success: true, message: 'Email service is ready' };
//   } catch (error) {
//     logError('Email connection test failed:', error);
//     return { 
//       success: false, 
//       error: error.message,
//       details: 'Check your email configuration and credentials'
//     };
//   }
// };


// export const sendTestEmail = async (toEmail) => {
//   try {
//     const mailOptions = {
//       from: `"${process.env.EMAIL_FROM_NAME || 'Test Email'}" <${process.env.EMAIL_FROM || 'thehindutourism@gmail.com'}>`,
//       to: toEmail,
//       subject: 'Test Email from The Hindu Tourism',
//       text: 'This is a test email from The Hindu Tourism backend service.',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #2d3748;">Test Email Successful</h2>
//           <p>This email confirms that your email service is properly configured.</p>
//           <p>Sent from The Hindu Tourism backend service.</p>
//         </div>
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     return { 
//       success: true, 
//       message: 'Test email sent successfully',
//       messageId: info.messageId 
//     };
//   } catch (error) {
//     logError('Failed to send test email:', error);
//     return { 
//       success: false, 
//       error: error.message,
//       details: 'Check your email configuration'
//     };
//   }
// };