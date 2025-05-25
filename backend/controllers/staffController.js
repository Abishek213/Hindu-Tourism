import Staff from '../models/Staff.js';
import Role from '../models/Role.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

// (Admin only)
// @route   POST /api/staff
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

// (Admin only)
// @route   GET /api/staff
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

// (Admin only)
// @route   GET /api/staff/:id
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

// (Admin only)
// @route   PUT /api/staff/:id
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

// (Admin only)
// @route   DELETE /api/staff/:id
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

// (Admin only)
// @route   GET /api/staff/search
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
