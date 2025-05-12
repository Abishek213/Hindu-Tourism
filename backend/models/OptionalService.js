import mongoose from 'mongoose';

const optionalServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('OptionalService', optionalServiceSchema);