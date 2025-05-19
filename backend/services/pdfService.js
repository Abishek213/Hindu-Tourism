import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

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
