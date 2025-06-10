import mongoose from 'mongoose';

const communicationLogSchema = new mongoose.Schema({
  lead_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead'
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  log_date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['email', 'call', 'meeting', 'message', 'other'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('CommunicationLog', communicationLogSchema);