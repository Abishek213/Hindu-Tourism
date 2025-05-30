import express from 'express';
import {
    createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    updateStatus,
    updateTravelStatus,
    generateBookingPDF
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);

router.post('/',
    checkRole('Admin', 'Sales Agent'),
    createBooking
);

router.get('/',
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    getAllBookings
);

router.get('/:id',
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    getBooking
);

router.put('/:id',
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    updateBooking
);

router.put('/:id/status',
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    updateStatus
);

router.put('/:id/travel-status',
  checkRole('Admin', 'Operation Team'),
  updateTravelStatus
);

router.get('/:id/generatepdf',
    checkRole('Admin', 'Sales Agent'),
    generateBookingPDF
);

export default router;
