import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Staff from '../models/Staff.js';

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = await Staff.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role.role_name)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role.role_name} is not authorized to access this route`
      });
    }
    next();
  };
};