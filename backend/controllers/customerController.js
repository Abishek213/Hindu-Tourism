import mongoose from 'mongoose';
import Customer from '../models/Customer.js';
import Booking from '../models/Booking.js';

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, nationality, is_vip } = req.body;

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      nationality,
      is_vip: is_vip || false,
      source: 'manual_entry'
    });

    res.status(201).json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      is_vip: customer.is_vip
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, is_vip } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (is_vip) {
      query.is_vip = is_vip === 'true';
    }

    const customers = await Customer.find(query)
      .select('-__v -password')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort('-createdAt');

    const count = await Customer.countDocuments(query);

    res.json({
      total: count,
      page: parseInt(page),
      customers
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getCustomer = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const customer = await Customer.findById(req.params.id)
      .populate('documents bookings')
      .lean();

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'phone', 'address', 'nationality', 'is_vip', 'special_notes'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(400).json({ error: error.message });
  }
};

export const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer_id: req.params.id })
      .populate('package_id', 'title duration_days')
      .sort('-travel_start_date');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};