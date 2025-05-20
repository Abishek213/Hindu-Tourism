import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';
import CommunicationLog from '../models/CommunicationLog.js';
import { validationResult } from 'express-validator';

// @desc    Create new lead
// @route   POST /api/leads
// @access  Admin, Sales Agent
export const createLead = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, source = 'other', notes = '', status = 'new' } = req.body;

    // Validate against schema enums
    const validSources = ['website', 'referral', 'social_media', 'walk_in', 'other'];
    const validStatuses = ['new', 'contacted', 'qualified', 'lost'];
    
    if (!validSources.includes(source.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid source value' });
    }

    if (status && !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      source: source.toLowerCase(),
      status: status.toLowerCase(),
      notes,
      staff_id: req.user._id
    });

    res.status(201).json({
      _id: lead._id,
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
};

// @desc    Get all leads with optional filters
// @route   GET /api/leads
// @access  Admin, Sales Agent
export const getAllLeads = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const leads = await Lead.find(query).sort('-created_date');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get lead by ID with staff details
// @route   GET /api/leads/:id
// @access  Admin, Sales Agent
export const getLeadById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const lead = await Lead.findById(req.params.id)
      .populate({
        path: 'staff_id',
        select: 'name email',
        populate: {
          path: 'role_id',
          select: 'role_name'
        }
      })
      .lean()
      .exec();
    
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Database operation failed' });
  }
};

// @desc    Update lead status and notes
// @route   PUT /api/leads/:id
// @access  Admin, Sales Agent
export const updateLead = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    if (status) lead.status = status;
    if (notes) lead.notes = notes;

    await lead.save();
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Convert lead to customer
// @route   POST /api/leads/:id/convert
// @access  Admin, Sales Agent
export const convertLeadToCustomer = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    if (lead.status === 'converted') {
      return res.status(400).json({
        error: 'Lead already converted',
        customer_id: lead.customer_id
      });
    }

    // Check for existing customer
    let customer = await Customer.findOne({ email: lead.email });
    
    if (!customer) {
      customer = await Customer.create({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        nationality: 'Indian'
      });
    } else {
      customer.name = lead.name;
      customer.phone = lead.phone;
      customer.source = lead.source;
      await customer.save();
    }

    lead.status = 'converted';
    lead.customer_id = customer._id;
    await lead.save();

    res.status(200).json({
      message: customer.isNew ? 'New customer created' : 'Existing customer updated',
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Conversion failed' });
  }
};

// @desc    Add communication log to lead
// @route   POST /api/leads/:id/logs
// @access  Admin, Sales Agent
export const addCommunicationLog = async (req, res) => {
  try {
    const { type, content } = req.body;
    
    // Check if req.body exists and is an object
    if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is missing or empty' });
    }
    
    // Validate required fields
    if (!type) {
      return res.status(400).json({ error: 'Communication type is required' });
    }
    
    if (!content) {
      return res.status(400).json({ error: 'Communication content is required' });
    }
    
    // Validate type against enum values
    const validTypes = ['email', 'call', 'meeting', 'message', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Invalid communication type',
        validTypes
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const log = await CommunicationLog.create({
      lead_id: lead._id,
      staff_id: req.user._id,
      type,
      content,
    });

    // Check if communication_logs array exists, initialize if not
    if (!lead.communication_logs) {
      lead.communication_logs = [];
    }
    
    lead.communication_logs.push(log._id);
    await lead.save();

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add communication log' });
  }
};

// @desc    Search leads by query, status, or source
// @route   GET /api/leads/search
// @access  Admin, Sales Agent
export const searchLeads = async (req, res) => {
  try {
    const { query, status, source } = req.query;
    
    if (!query && !status && !source) {
      return res.status(400).json({ 
        error: 'At least one search parameter (query, status, or source) is required' 
      });
    }

    const searchConditions = {};

    if (query) {
      searchConditions.$or = [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ];
    }

    if (status) {
      searchConditions.status = status.toLowerCase();
    }

    if (source) {
      searchConditions.source = source.toLowerCase();
    }

    const leads = await Lead.find(searchConditions)
      .select('name email phone status source created_date')
      .sort('-created_date')
      .limit(20);

    res.json(leads);

  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};