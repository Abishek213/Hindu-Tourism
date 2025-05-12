import mongoose from 'mongoose';

const transportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['bus', 'car', 'train', 'flight', 'cruise', 'other'],
    required: true
  },
  contact_info: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Transport', transportSchema);