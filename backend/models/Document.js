import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  document_type: {
    type: String,
    required: true,
    enum: ['passport', 'visa', 'id_proof', 'ticket', 'other']
  },
  file_path: {
    type: String,
    required: true
  },
  upload_date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);