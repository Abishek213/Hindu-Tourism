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
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add virtual population
packageSchema.virtual('itineraries', {
  ref: 'PackageItinerary',
  localField: '_id',
  foreignField: 'package_id'
});

export default mongoose.model('Package', packageSchema);