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
    req.user = await Staff.findById(decoded.id).populate('role_id');
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Updated role checking
export const checkLeadAccess = async (req, res, next) => {
  try {
    // Ensure we have fresh role data
    const staff = await Staff.findById(req.user._id).populate('role_id');
    
    if (!staff) {
      return res.status(403).json({
        success: false,
        message: 'Staff record not found'
      });
    }

    const allowedRoles = ['Admin', 'Sales Agent'];
    
    if (!staff.role_id || !allowedRoles.includes(staff.role_id.role_name)) {
      return res.status(403).json({
        success: false,
        message: `Role ${staff.role_id?.role_name || 'undefined'} not authorized`
      });
    }

    // Update request user with fresh data
    req.user = staff;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Authorization check failed'
    });
  }
};