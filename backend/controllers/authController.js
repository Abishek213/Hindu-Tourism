import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';
import Staff from '../models/Staff.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return next(new Error('Please provide both username and password'));
    }

    // Fetch the user from the database, selecting the password field
    const staff = await Staff.findOne({ username }).select('+password_hash');

    // If the user is not found, return an error
    if (!staff) {
      return next(new Error('Invalid credentials'));
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, staff.password_hash);

    if (!isMatch) {
      // Passwords don't match, return an error
      return next(new Error('Invalid credentials'));
    }

    // If the password matches, generate a JWT token
    const token = jwt.sign({ id: staff._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE
    });

    // Return the token as part of the successful response
    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};
