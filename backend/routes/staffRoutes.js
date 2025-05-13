import express from 'express';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  searchStaff
} from '../controllers/staffController.js';

const router = express.Router();

// Admin-only routes
router.route('/')
  .post(protect, checkRole('Admin'), createStaff)  // Create staff
  .get(protect, checkRole('Admin'), getAllStaff);  // List all staff

router.route('/search')
  .get(protect, checkRole('Admin'), searchStaff);  // Search staff

router.route('/:id')
  .get(protect, checkRole('Admin'), getStaffById)   // Get single staff
  .put(protect, checkRole('Admin'), updateStaff)    // Update staff
  .delete(protect, checkRole('Admin'), deleteStaff); // Deactivate staff

export default router;