import express from 'express';
import {
    createPayment,
    getPaymentsByBooking,
    updatePaymentStatus
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Create a payment (accessible by admin, accountant)
router.post('/', 
    protect, 
    checkRole('Admin', 'Accountant'), 
    createPayment
);

// Get payments by booking (accessible by admin, accountant, sales)
router.get('/booking/:booking_id', 
    protect, 
    checkRole('Admin', 'Accountant', 'Sales Agent'), 
    getPaymentsByBooking
);

// Update payment status (accessible by admin, accountant)
router.put('/:payment_id/status', 
    protect, 
    checkRole('Admin', 'Accountant'), 
    updatePaymentStatus
);

export default router;