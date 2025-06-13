import mongoose from 'mongoose';
import { sendInvoiceEmail } from '../services/emailService.js';

const invoiceSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  invoice_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'advance', 'cancelled'],
    default: 'draft'
  }
}, { timestamps: true });

// Add post-save hook for email sending
invoiceSchema.post('save', async function(doc) {
  if (doc.status === 'sent') {
    try {
      await sendInvoiceEmail(doc._id);
    } catch (error) {
      console.error('Error sending invoice email in post-save hook:', error);
    }
  }
});

// Add post-update hook for email sending
invoiceSchema.post('findOneAndUpdate', async function(doc) {
  if (doc && doc.status === 'sent') {
    try {
      await sendInvoiceEmail(doc._id);
    } catch (error) {
      console.error('Error sending invoice email in post-update hook:', error);
    }
  }
});

export default mongoose.model('Invoice', invoiceSchema);