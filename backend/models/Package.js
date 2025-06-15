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
    deluxe: { type: String, default: "" },
    premium: { type: String, default: "" },
    exclusive: { type: String, default: "" }
  },
  exclusions: {
    deluxe: { type: String, default: "" },
    premium: { type: String, default: "" },
    exclusive: { type: String, default: "" }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  brochure_url: {
    type: String
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

packageSchema.virtual('packageItineraries', {
  ref: 'PackageItinerary',
  localField: '_id',
  foreignField: 'package_id'
});

// Enable virtuals in JSON responses
packageSchema.set('toObject', { virtuals: true });
packageSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Package', packageSchema);