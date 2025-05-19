import express from 'express';
import {
    createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    assignGuide,
    assignTransport,
    updateStatus,
    generateBookingPDF
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Create booking from lead (Sales Agent, Admin)
router.post('/',
    checkRole('Admin', 'Sales Agent'),
    createBooking
);

// Get all bookings (Admin, Sales Agent, Operation Team)
router.get('/',
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    getAllBookings
);

// Get single booking (Admin, Sales Agent, Operation Team)
router.get('/:id',
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    getBooking
);

// Update booking (Admin, Sales Agent, Operation Team)
router.put('/:id',
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    updateBooking
);

// Assign guide (Operation Team, Admin)
router.put('/:id/assignguide',
    checkRole('Admin', 'Operation Team'),
    assignGuide
);

// Assign transport (Operation Team, Admin)
router.put('/:id/assigntransport',
    checkRole('Admin', 'Operation Team'),
    assignTransport
);

// Update booking status (Admin, Sales Agent, Operation Team)
router.put('/:id/status',
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    updateStatus
);

// Generate booking PDF (Admin, Sales Agent)
router.get('/:id/generatepdf',
    checkRole('Admin', 'Sales Agent'),
    generateBookingPDF
);
// router.get('/whoami', (req, res) => {
//   res.json(req.user);
// });

export default router;