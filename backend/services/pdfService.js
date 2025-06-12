import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import fs from 'fs';
import path from 'path';

export const generateBookingPDF = async (data) => {
  const doc = new PDFDocument();
  const stream = new PassThrough();

  return new Promise((resolve, reject) => {
    let chunks = [];

    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);

    doc.pipe(stream);

    doc.fontSize(20).text('Hindu Tourism Booking Summary', { align: 'center' });
    doc.moveDown();

    doc.text(`Booking ID: ${data.booking?._id || 'N/A'}`);
    doc.text(`Customer: ${data.booking?.customer_id?.name || 'N/A'}`);
    doc.text(`Email: ${data.booking?.customer_id?.email || 'N/A'}`);
    doc.text(`Phone: ${data.booking?.customer_id?.phone || 'N/A'}`);
    doc.text(`Package: ${data.booking?.package_id?.title || 'N/A'}`);
    doc.text(`Travel Dates: ${new Date(data.booking?.travel_start_date).toDateString()} to ${new Date(data.booking?.travel_end_date).toDateString()}`);
    doc.text(`Number of Travelers: ${data.booking?.num_travelers || 'N/A'}`);
    doc.text(`Special Requirements: ${data.booking?.special_requirements || 'None'}`);
    doc.text(`Status: ${data.booking?.status || 'N/A'}`);

    doc.moveDown();

    if (data.booking?.guide_id) {
      doc.text(`Guide: ${data.booking.guide_id.name || 'N/A'} (${data.booking.guide_id.phone || 'N/A'})`);
    }

    if (data.booking?.transport_id) {
      doc.text(`Transport: ${data.booking.transport_id.name || 'N/A'} (${data.booking.transport_id.type || 'N/A'})`);
    }
    if (data.services?.length) {
      doc.moveDown().text('Optional Services:', { underline: true });
      data.services.forEach(service => {
        const name = service.service_id?.name || 'Unknown Service';
        doc.text(`- ${name}: $${service.price_applied}`);
      });
    }

    if (data.invoice) {
      doc.moveDown().text('Invoice:', { underline: true });
      doc.text(`Amount: $${data.invoice.amount}`);
      doc.text(`Status: ${data.invoice.status}`);
    }

    doc.end();
  });
};

export const generateInvoicePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    // Buffer setup
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    try {
      // Safe data access with defaults
      const booking = invoice.booking_id || {};
      const customer = booking.customer_id || {};
      const pkg = booking.package_id || {};
      const inclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions.map(String) : [];
const exclusions = Array.isArray(pkg.exclusions) ? pkg.exclusions.map(String) : [];
      const numTravelers = booking.num_travelers || 1;

      // Logo handling
      const logoPath = path.join(process.cwd(), 'uploads', 'logo', 'logo.png');
      try {
        const logo = fs.readFileSync(logoPath);
        doc.image(logo, 50, 45, { width: 50 });
      } catch (logoError) {
        console.warn('Company logo not found, proceeding without it');
      }

      // Header
      doc.fontSize(20)
        .text('INVOICE', 200, 50, { align: 'right' })
        .fontSize(10)
        .text(`Invoice ID: ${invoice._id}`, { align: 'right' })
        .text(`Date: ${new Date(invoice.invoice_date).toLocaleDateString()}`, { align: 'right' });

      // Customer Information
      doc.fontSize(12)
        .text('Bill To:', 50, 120)
        .fontSize(10)
        .text(customer.name, 50, 140)
        .text(customer.email, 50, 155)
        .text(customer.phone, 50, 170);

      // Package Details
      let y = 220;
      doc.fontSize(12)
        .text('Package Details:', 50, y)
        .fontSize(10)
        .text(`Title: ${pkg.title || 'No package title'}`, 50, y + 20)
        .text(`Duration: ${pkg.duration_days || 0} days`, 50, y + 35)
        .text(`Base Price: $${pkg.base_price || 0}`, 50, y + 50)
        .text(`Travelers: ${numTravelers}`, 50, y + 65);

      // Inclusions/Exclusions
      y += 100;
      doc.fontSize(12).text('Includes:', 50, y);
      inclusions.forEach((item, index) => {
        doc.fontSize(10).text(`• ${item}`, 50, y + 15 + (index * 15));
      });

      y += (inclusions.length * 15) + 30;
      doc.fontSize(12).text('Excludes:', 50, y);
      exclusions.length > 0 
        ? exclusions.forEach((item, index) => {
            doc.fontSize(10).text(`• ${item}`, 50, y + 15 + (index * 15));
          })
        : doc.fontSize(10).text('No exclusions listed', 50, y + 15);

      // Invoice Breakdown
      y = 450;
      doc.fontSize(12)
        .text('Amount Due:', 50, y)
        .fontSize(14)
        .text(`$${invoice.amount || 0}`, 50, y + 20)
        .fontSize(10)
        .text(`Status: ${invoice.status.toUpperCase()}`, 50, y + 45);

      // Footer
      doc.fontSize(8)
        .text('Thank you for your business!', 50, 780, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(new Error(`PDF generation failed: ${err.message}`));
    }
  });
};
