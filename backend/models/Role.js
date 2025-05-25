import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
    unique: true,
    enum: ['Admin', 'Sales Agent', 'Operation Team', 'Accountant']
  },
  manage_users_access: {
    type: Boolean,
    default: false
  },
  manage_leads_access: {
    type: Boolean,
    default: false
  },
  manage_bookings_access: {
    type: Boolean,
    default: false
  },
  manage_packages_access: {
    type: Boolean,
    default: false
  },
  manage_payments_access: {
    type: Boolean,
    default: false
  },
  generate_reports_access: {
    type: Boolean,
    default: false
  },
  assign_guides_access: {
    type: Boolean,
    default: false
  },
  update_travel_progress_access: {
    type: Boolean,
    default: false
  },
  manage_invoices_access: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);