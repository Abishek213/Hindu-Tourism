// routes/packageRoutes.js
import express from 'express';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import {
    createPackage,
    updatePackage,
    getAllPackages,
    getPackageById,
    updatePackageStatus,
    addItinerary,
    updateItinerary,
    deleteItinerary
} from '../controllers/packageController.js';
import { brochureUpload } from '../services/fileUpload.js';
import { validatePackage, validateItinerary } from '../utils/validators.js';

const router = express.Router();

// Admin-only routes
router.route('/')
    .post(protect, checkRole('Admin', 'Operation Team'), brochureUpload.single('brochure'), validatePackage, createPackage)
    .get(protect, checkRole('Admin', 'Operation Team'), getAllPackages);

// Status route MUST come before /:id route to avoid conflicts
router.route('/:id/status')
    .patch(protect, checkRole('Admin', 'Operation Team'), updatePackageStatus);

// Individual package routes
router.route('/:id')
    .get(protect, checkRole('Admin', 'Operation Team'), getPackageById)
    .put(protect, checkRole('Admin', 'Operation Team'), updatePackage);

// Itinerary routes
router.route('/:packageId/itineraries')
    .post(protect, checkRole('Admin', 'Operation Team'), validateItinerary, addItinerary);

router.route('/itineraries/:itineraryId')
    .put(protect, checkRole('Admin', 'Operation Team'), validateItinerary, updateItinerary)
    .delete(protect, checkRole('Admin'), deleteItinerary);

export default router;