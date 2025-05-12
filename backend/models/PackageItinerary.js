import mongoose from 'mongoose';

const packageItinerarySchema = new mongoose.Schema({
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  day_number: {
    type: Number,
    required: true,
    min: 1
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  accommodation: {
    type: String
  },
  meals: {
    type: String
  },
  transport: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('PackageItinerary', packageItinerarySchema);