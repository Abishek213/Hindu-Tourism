import mongoose from 'mongoose';

const bookingServiceSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OptionalService',
    required: true
  },
  price_applied: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

export default mongoose.model('BookingService', bookingServiceSchema);