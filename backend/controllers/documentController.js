import Document from '../models/Document.js';
import Booking from '../models/Booking.js';
import Customer from '../models/Customer.js';
// import Package from '../models/Package.js';
// import { generateDocumentPDF as generatePDF } from '../services/pdfService.js';
import logger from '../utils/logger.js';

export const uploadDocuments = async (req, res) => {
  try {
    const { booking_id } = req.params;
    let { documents } = req.body;
    const files = req.files || [];

    // Parse documents if it's a JSON string
    if (typeof documents === 'string') {
      try {
        documents = JSON.parse(documents);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid documents format' });
      }
    }

    // Validate booking exists
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const uploadedDocuments = [];

    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      const file = files[i];

      const { document_type, is_main_customer, customer_id } = doc;

      // Validate main customer requirements
      if (is_main_customer) {
        if (!customer_id) {
          return res.status(400).json({ error: 'Main customer document must include customer_id' });
        }

        // Fetch customer name from the Customer table
        const customer = await Customer.findById(customer_id);
        if (!customer) {
          return res.status(404).json({ error: 'Customer not found' });
        }

        // Auto-populate traveler_name from customer data
        doc.traveler_name = customer.name; // ✅
      } else {
        // Require traveler_name for non-main customers
        if (!doc.traveler_name) {
          return res.status(400).json({ error: 'Traveler name is required for non-main customers' });
        }
      }

      // Create document record
      const newDoc = new Document({
        booking_id: booking_id,
        customer_id: is_main_customer ? customer_id : null,
        traveler_name: doc.traveler_name, // Now auto-populated for main customer
        document_type: document_type,
        file_path: file.path,
        upload_date: new Date(),
        is_main_customer: is_main_customer || false
      });

      await newDoc.save();
      uploadedDocuments.push(newDoc);
    }

    res.status(201).json({
      message: 'Documents uploaded successfully',
      documents: uploadedDocuments
    });
  } catch (error) {
    logger.error(`Error uploading documents: ${error.message}`);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
};

export const getBookingDocuments = async (req, res) => {
    try {
        const { booking_id } = req.params;
        
        const documents = await Document.find({ booking_id: booking_id })
            .sort({ upload_date: -1 });

        res.json(documents);
    } catch (error) {
        logger.error(`Error fetching booking documents: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

// In documentController.js
export const deleteDocumentsByBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;

    // First check if booking exists
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Delete all documents for this booking
    const result = await Document.deleteMany({ booking_id });
    
    res.json({
      message: `Deleted ${result.deletedCount} documents for booking ${booking_id}`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    logger.error(`Error deleting documents: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete documents' });
  }
};