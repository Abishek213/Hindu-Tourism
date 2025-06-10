import Staff from '../models/Staff.js';
import Role from '../models/Role.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';


export const getCurrentUserProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id)
      .select('-password_hash')
      .populate('role_id', 'role_name');

    if (!staff) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      username: staff.username,
      phone: staff.phone,
      role: staff.role_id.role_name,
      is_active: staff.is_active
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCurrentUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, name, email, phone, currentPassword } = req.body;
    const userId = req.user.id;

    // Verify current password if provided (for security)
    if (currentPassword) {
      const staff = await Staff.findById(userId).select('+password_hash');
      if (!staff) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isPasswordValid = await staff.matchPassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    // Check if username already exists (excluding current user)
    if (username) {
      const existingUser = await Staff.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    // Check if email already exists (excluding current user)
    if (email) {
      const existingUser = await Staff.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Update user profile
    const updateData = {};
    if (username) updateData.username = username;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    const updatedStaff = await Staff.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    )
      .select('-password_hash')
      .populate('role_id', 'role_name');

    if (!updatedStaff) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      _id: updatedStaff._id,
      name: updatedStaff.name,
      email: updatedStaff.email,
      username: updatedStaff.username,
      phone: updatedStaff.phone,
      role: updatedStaff.role_id.role_name,
      is_active: updatedStaff.is_active
    });
  } catch (error) {
    console.error('updateCurrentUserProfile error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required' });
    }

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get user with password
    const staff = await Staff.findById(userId).select('+password_hash');
    if (!staff) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await staff.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Check if new password is different from current
    const isSamePassword = await staff.matchPassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password must be different from current password' });
    }

    // Update password (the pre-save hook will handle hashing)
    staff.password_hash = newPassword;
    await staff.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('changePassword error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createStaff = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, username, phone, password, role: roleName } = req.body;

    // Check if role exists
    const role = await Role.findOne({ role_name: roleName });
    if (!role) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check for existing staff
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ error: 'Staff member already exists' });
    }

    // Remove manual password hashing and just pass the plain password
    const staff = await Staff.create({
      name,
      email,
      username,
      phone,
      password_hash: password, 
      role_id: role._id
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      username: staff.username,
      role: role.role_name,
      is_active: staff.is_active
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    if (role) {
      const roleDoc = await Role.findOne({ role_name: role });
      if (roleDoc) query.role_id = roleDoc._id;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const staff = await Staff.find(query)
      .select('-password_hash')
      .populate('role_id', 'role_name')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * limit)
      .sort('-createdAt');

    const count = await Staff.countDocuments(query);

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      staff
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select('-password_hash')
      .populate('role_id', 'role_name');

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const { role: roleName, password, ...updateData } = req.body;

    if (roleName) {
      const role = await Role.findOne({ role_name: roleName });
      if (!role) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }
      updateData.role_id = role._id;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password_hash = await bcrypt.hash(password, salt);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password_hash');

    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Soft delete (set is_active to false)
    staff.is_active = false;
    await staff.save();

    res.json({ message: 'Staff member deactivated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const searchStaff = async (req, res) => {
  try {
    const { query } = req.query;

    const staff = await Staff.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } }
      ]
    })
      .select('-password_hash')
      .populate('role_id', 'role_name')
      .limit(10);

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
