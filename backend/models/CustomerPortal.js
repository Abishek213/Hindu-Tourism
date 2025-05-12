import mongoose from 'mongoose';

const customerPortalSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  access_token: {
    type: String,
    required: true,
    unique: true
  },
  expiry_date: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('CustomerPortal', customerPortalSchema);