import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  nationality: {
    type: String
  },
  special_notes: {
    type: String
  },
  is_vip: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Virtual for documents relationship (Customer has many Documents)
customerSchema.virtual('documents', {
  ref: 'Document',
  localField: '_id',
  foreignField: 'customer_id'
});

// Virtual for bookings relationship (Customer has many Bookings)
customerSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'customer_id'
});

export default mongoose.model('Customer', customerSchema);