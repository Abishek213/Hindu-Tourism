import express from 'express';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  changePassword,
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  searchStaff
} from '../controllers/staffController.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getCurrentUserProfile)
  .put(protect, updateCurrentUserProfile);

router.route('/change-password')
  .put(protect, changePassword);


router.route('/')
  .post(protect, checkRole('Admin'), createStaff)  
  .get(protect, checkRole('Admin'), getAllStaff);  

router.route('/search')
  .get(protect, checkRole('Admin'), searchStaff);  

router.route('/:id')
  .get(protect, checkRole('Admin'), getStaffById)   
  .put(protect, checkRole('Admin'), updateStaff)   
  .delete(protect, checkRole('Admin'), deleteStaff); 

export default router;