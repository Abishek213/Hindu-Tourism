import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

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
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
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

export const generateDocumentPDF = (template, data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    try {
      // Common data extraction
      const { booking, customer, documents, package: pkg } = data;
      const bookingDate = new Date(booking.booking_date).toLocaleDateString();
      
      // Logo handling
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      try {
        const logo = fs.readFileSync(logoPath);
        doc.image(logo, 50, 45, { width: 50 });
      } catch (logoError) {
        console.warn('Company logo not found, proceeding without it');
      }

      // Template-specific content
      if (template === 'confirmation') {
        // Header Section
        doc.fontSize(20)
          .text('BOOKING CONFIRMATION', 200, 50, { align: 'right' })
          .fontSize(10)
          .text(`Booking ID: ${booking.id}`, { align: 'right' })
          .text(`Booking Date: ${bookingDate}`, { align: 'right' });

        // Customer Information
        doc.fontSize(12)
          .text('Customer Details:', 50, 120)
          .fontSize(10)
          .text(`Name: ${customer.name}`, 50, 140)
          .text(`Email: ${customer.email}`, 50, 155)
          .text(`Phone: ${customer.phone}`, 50, 170);

        // Package Details
        let y = 220;
        doc.fontSize(12)
          .text('Package Information:', 50, y)
          .fontSize(10)
          .text(`Title: ${pkg.title || 'N/A'}`, 50, y + 20)
          .text(`Duration: ${pkg.duration_days} days`, 50, y + 35)
          .text(`Destination: ${pkg.destination || 'N/A'}`, 50, y + 50)
          .text(`Travelers: ${booking.num_travelers}`, 50, y + 65);

        // Uploaded Documents
        y += 100;
        doc.fontSize(12)
          .text('Uploaded Documents:', 50, y);
        
        if (documents.length > 0) {
          documents.forEach((docItem, index) => {
            doc.fontSize(10)
              .text(`• ${docItem.document_type}: ${docItem.traveler_name}`, 
                50, y + 20 + (index * 15));
          });
        } else {
          doc.fontSize(10)
            .text('No documents uploaded yet', 50, y + 20);
        }

        // Terms and Conditions
        y = 500;
        doc.fontSize(10)
          .text('Confirmation Terms:', 50, y)
          .text('1. This document serves as official confirmation of your booking', 50, y + 15)
          .text('2. Please review all details and contact us with any discrepancies', 50, y + 30);

        // Footer
        doc.fontSize(8)
          .text('Thank you for choosing our travel services!', 50, 780, { align: 'center' });
      }

      doc.end();
    } catch (err) {
      reject(new Error(`PDF generation failed: ${err.message}`));
    }
  });
};