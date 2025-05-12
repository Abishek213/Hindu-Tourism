import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: String,
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true
  },
  password_hash: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }
}, {
  timestamps: true
});

// Encrypt password
staffSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

// Match password
staffSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

export default mongoose.model('Staff', staffSchema);