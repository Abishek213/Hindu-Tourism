import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
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
  payment_date: {
    type: Date,
    default: Date.now
  },
  payment_method: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'other']
  },
  transaction_id: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'advance'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);