import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  package_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  travel_start_date: {
    type: Date,
    required: true
  },
  travel_end_date: {
    type: Date,
    required: true
  },
  num_travelers: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  guide_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide'
  },
  transport_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transport'
  },
  booking_date: {
    type: Date,
    default: Date.now
  },
  special_requirements: {
    type: String
  },
  package_type: {
    type: String,
    enum: ['Premium','Deluxe',' Exclusive'],
    default: 'Deluxe'
  },
  travelStatus: {
    type: String,
    enum: ['Not Started', 'On the Way', 'At Destination', 'Return Journey', 'Completed', 'Delayed', 'Cancelled'],
    default: 'Not Started'
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);