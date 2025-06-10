import express from 'express';
import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  getCustomerBookings
} from '../controllers/customerController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Create
router.post('/', protect, checkRole('Admin', 'Sales Agent'), createCustomer);

// Read
router.get('/', protect, checkRole('Admin', 'Sales Agent'), getCustomers);
router.get('/:id', protect, checkRole('Admin', 'Sales Agent'), getCustomer);
router.get('/:id/bookings', protect, checkRole('Admin', 'Sales Agent'), getCustomerBookings);

// Update
router.put('/:id', protect, checkRole('Admin'), updateCustomer);

export default router;