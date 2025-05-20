import express from 'express';
import {
  createCommunicationLog,
  getAllCommunicationLogs,
  getLogsByLeadOrCustomer,
  updateCommunicationLog,
  deleteCommunicationLog
} from '../controllers/communicationController.js';

import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();
router.use(protect);

// @route   POST /api/communication-logs/
// @desc    Create a new communication log
// @access  Protected (staff or admin)
router.post(
  '/createlog',
  checkRole('Admin', 'Sales Agent'),
  createCommunicationLog
);

// @route   GET /api/communication-logs/
// @desc    Get all communication logs
// @access  Protected (admin only)
router.get(
  '/',
  checkRole('Admin', 'Sales Agent'),
  getAllCommunicationLogs
);

// @route   GET /api/communication-logs/by-lead-or-customer/:id
// @desc    Get logs by lead_id or customer_id
// @access  Protected (staff or admin)
router.get(
  '/byleadorcustomer/:id',
  checkRole('Admin', 'Sales Agent'),
  getLogsByLeadOrCustomer
);

// @route   PUT /api/communication-logs/:id
// @desc    Update a communication log
// @access  Protected (staff or admin)
router.put(
  '/:id',
  checkRole('Admin', 'Sales Agent'),
  updateCommunicationLog
);

// @route   DELETE /api/communication-logs/:id
// @desc    Delete a communication log
// @access  Protected (admin only)
router.delete(
  '/:id',
  checkRole('Admin'),
  deleteCommunicationLog
);

export default router;
