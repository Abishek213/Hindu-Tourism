import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Staff from '../models/Staff.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, username, password, role_id } = req.body;

    const staff = await Staff.create({
      name,
      email,
      username,
      password_hash: password,
      role_id
    });

    const token = jwt.sign({ id: staff._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE
    });

    res.status(201).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new Error('Please provide username and password'));
    }

    const staff = await Staff.findOne({ username }).select('+password_hash');

    if (!staff || !(await staff.matchPassword(password))) {
      return next(new Error('Invalid credentials'));
    }

    const token = jwt.sign({ id: staff._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE
    });

    res.status(200).json({
      success: true,
      token
    });
  } catch (err) {
    next(err);
  }
};