// routes/packageRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import {
    createPackage,
    updatePackage,
    getAllPackages,
    getPackageById,
    togglePackageStatus,
    addItinerary,
    updateItinerary,
    deleteItinerary
} from '../controllers/packageController.js';
import upload from '../services/fileUpload.js';
import { validatePackage, validateItinerary } from '../utils/validators.js';

const router = express.Router();

// Admin-only routes
router.route('/')
    .post(protect, checkRole('Admin'), upload.single('brochure'), validatePackage, createPackage)
    .get(protect, checkRole('Admin', 'Operation Team'), getAllPackages);

router.route('/:id')
    .get(protect, checkRole('Admin', 'Operation Team'), getPackageById)
    .put(protect, checkRole('Admin'), upload.single('brochure'), validatePackage, updatePackage)
    .patch(protect, checkRole('Admin'), togglePackageStatus);

// Itinerary routes
router.route('/:packageId/itineraries')
    .post(protect, checkRole('Admin', 'Operation Team'), validateItinerary, addItinerary);

router.route('/itineraries/:itineraryId')
    .put(protect, checkRole('Admin', 'Operation Team'), validateItinerary, updateItinerary)
    .delete(protect, checkRole('Admin'), deleteItinerary);

export default router;