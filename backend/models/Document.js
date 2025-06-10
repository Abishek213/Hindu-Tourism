import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: function() { return this.is_main_customer; }
  },
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  document_type: {
    type: String,
    required: true,
    enum: ['Passport', 'Aadhaar Card']
  },
  file_path: {
    type: String,
    required: true
  },
  traveler_name: {
    type: String,
    required: true
  },
  is_main_customer: {
    type: Boolean,
    default: false
  },
  upload_date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);