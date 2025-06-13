import express from 'express';
import {
    createPayment,
    getPaymentsByBooking,
    updatePaymentStatus,
     updatePayment,
     getAllPayments ,
     getPaymentSummary,
     recordPayment,
     getLatestPaymentsPerBooking
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Create a payment (accessible by admin, accountant)
router.post('/', 
    protect, 
    checkRole('Admin', 'Accountant', 'Sales Agent'), // Added 'Sales Agent' as they might need to create payments
    createPayment
);

router.put('/record',
    protect,
    checkRole('Admin', 'Accountant', 'Sales Agent'),
    recordPayment
);

router.get('/latest-per-booking',
  protect,
  checkRole('Admin', 'Accountant', 'Sales Agent', 'Operation Team'),
  getLatestPaymentsPerBooking
);


router.get('/',
    protect,
    checkRole('Admin', 'Accountant', 'Sales Agent', 'Operation Team'), // Added 'Operation Team' as they might need to view all payments
    getAllPayments
);


// Get payments by booking (accessible by admin, accountant, sales)
router.get('/booking/:booking_id', 
    protect, 
    checkRole('Admin', 'Accountant', 'Sales Agent'), 
    getPaymentsByBooking
);

router.get('/summary/:booking_id',
    protect,
    checkRole('Admin', 'Accountant', 'Sales Agent', 'Operation Team'), // Anyone who can view payments should see summary
    getPaymentSummary
);

// Update payment status (accessible by admin, accountant)
router.put('/:payment_id/status', 
    protect, 
    checkRole('Admin', 'Accountant'), 
    updatePaymentStatus
);

router.put('/:payment_id',
    protect,
    checkRole('Admin', 'Accountant'),
    updatePayment
);

export default router;