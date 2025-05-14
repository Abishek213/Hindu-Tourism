import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';
import Staff from '../models/Staff.js'; // Assuming Staff is in the same directory
import Role from '../models/Role.js'; // Assuming Role is in the same directory

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return next(new Error('Please provide both username and password'));
    }

    // Fetch the staff, including the role details by populating role_id
    const staff = await Staff.findOne({ username })
      .select('+password_hash') // Ensure password is selected
      .populate('role_id'); // Populate the role details from the Role model

    // If the staff is not found, return an error
    if (!staff) {
      return next(new Error('Invalid credentials'));
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, staff.password_hash);

    if (!isMatch) {
      // Passwords don't match, return an error
      return next(new Error('Invalid credentials'));
    }

    // If the password matches, generate a JWT token including the role
    const token = jwt.sign(
      { id: staff._id, role: staff.role_id.role_name }, // Include role name in the payload
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRE }
    );

    // Return only the token, as the frontend will decode it
    res.status(200).json({
      success: true,
      token, // Send only the token to frontend
    });
  } catch (err) {
    next(err);
  }
};
