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

export default mongoose.model('Customer', customerSchema);