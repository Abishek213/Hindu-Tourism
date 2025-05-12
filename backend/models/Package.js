import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  base_price: {
    type: Number,
    required: true,
    min: 0
  },
  duration_days: {
    type: Number,
    required: true,
    min: 1
  },
  inclusions: {
    type: String,
    required: true
  },
  exclusions: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
  },
  brochure_url: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Package', packageSchema);