import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['website', 'referral', 'social_media', 'walk_in', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new'
  },
  staff_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  notes: {
    type: String
  }
}, { timestamps: true });

// Add query helpers
leadSchema.query.byStatus = function(status) {
  return this.where({ status });
};

export default mongoose.model('Lead', leadSchema);