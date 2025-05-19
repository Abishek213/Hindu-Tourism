import express from 'express';
import {
  createTransport,
  getTransports,
  updateTransportStatus,
   checkTransportStatus,
} from '../controllers/transportController.js';

import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
const router = express.Router();
router.use(protect);

/**
 * @route   POST /api/transports
 * @access  Private (Sales Agent, Admin)
 */
router.post(
  '/create',
  checkRole('Sales Agent', 'Admin'),
  createTransport
);

/**
 * @route   GET /api/transports
 * @access  Private (All roles)
 */
router.get('/', protect, getTransports);

/**
 * @route   PUT /api/transports/:id/status
 * @access  Private (Admin only)
 */
router.put(
  '/:id/status',
  checkRole('Admin'),
  updateTransportStatus
);

router.post('/checkstatus', checkTransportStatus);
checkRole('Admin');




export default router;
