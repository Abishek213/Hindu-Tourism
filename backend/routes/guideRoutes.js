import express from 'express';
import {
  createGuide,
  getGuides,
  updateGuideStatus,
  checkGuideStatus
} from '../controllers/guideController.js';

import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
const router = express.Router();
router.use(protect);
/**
 * @route   POST /api/guides/create
 * @access  Private (Sales Agent, Admin)
 */
router.post(
  '/create',
  checkRole('Sales Agent', 'Admin'),
  createGuide
);

/**
 * @route   GET /api/guides
 * @access  Private (All roles)
 */
router.get('/', protect, getGuides);

/**
 * @route   PUT /api/guides/:id/status
 * @access  Private (Admin only)
 */
router.put(
  '/:id/status',
  checkRole('Admin'),
  updateGuideStatus
);
router.post(
    '/checkstatus',
    checkRole('Admin'),
    checkGuideStatus
)

export default router;
