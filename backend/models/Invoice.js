import mongoose from 'mongoose';

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

export default mongoose.model('Invoice', invoiceSchema);