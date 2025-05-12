import mongoose from 'mongoose';

const guideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Guide', guideSchema);