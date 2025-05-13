import Staff from '../models/Staff.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

//(Admin only)
// @route   POST /api/staff
export const createStaff = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, role: roleName } = req.body;
    
    // Check if role exists
    const role = await Role.findOne({ name: roleName });
    if (!role) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check for existing staff
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ error: 'Staff member already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = await Staff.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role._id,
      createdBy: req.user.id
    });

    res.status(201).json({
      _id: staff.id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      role: role.name,
      isActive: staff.isActive
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//(Admin only)
// @route   GET /api/staff
export const getAllStaff = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const query = {};

    if (role) {
      const roleDoc = await Role.findOne({ name: role });
      if (roleDoc) query.role = roleDoc._id;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const staff = await Staff.find(query)
      .select('-password')
      .populate('role', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const count = await Staff.countDocuments(query);

    res.json({
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      staff
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//(Admin only)
// @route   GET /api/staff/:id
export const getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .select('-password')
      .populate('role', 'name');

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//(Admin only)
// @route   PUT /api/staff/:id
export const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const { role: roleName, ...updateData } = req.body;

    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }
      updateData.role = role._id;
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(updatedStaff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//(Admin only)
// @route   DELETE /api/staff/:id
export const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    // Soft delete (set isActive to false)
    staff.isActive = false;
    await staff.save();

    res.json({ message: 'Staff member deactivated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//(Admin only)
// @route   GET /api/staff/search
export const searchStaff = async (req, res) => {
  try {
    const { query } = req.query;
    
    const staff = await Staff.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('-password')
    .populate('role', 'name')
    .limit(10);

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};