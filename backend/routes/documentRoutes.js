import express from 'express';
import {
    uploadDocuments,
    getBookingDocuments,
    downloadDocument,
    deleteDocumentsByBooking
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { documentUpload } from '../services/fileUpload.js'; 

const router = express.Router();

// Upload documents for multiple travelers in a group
router.post(
    '/bookings/:booking_id',
    protect,
    checkRole('Admin', 'Sales Agent', 'Operation Team'),
    documentUpload.any(),
    uploadDocuments
);

// Other routes remain unchanged
router.get(
    '/bookings/:booking_id',
    protect,
    checkRole('Admin', 'Sales Agent', 'Operation Team', 'Accountant'),
    getBookingDocuments
);

router.delete(
    '/:booking_id',
    protect,
    checkRole('Admin', 'Sales Agent'),
    deleteDocumentsByBooking
);

export default router;