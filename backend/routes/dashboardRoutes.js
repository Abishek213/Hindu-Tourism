import express from 'express';
import { 
  getLeadStats,
  getLeadSources,
  getLeadStatus,
  getPackagePopularity,
  getCommunicationMethods
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/lead-stats', protect, getLeadStats);
router.get('/lead-sources', protect, getLeadSources);
router.get('/lead-status', protect, getLeadStatus);
router.get('/package-popularity', protect, getPackagePopularity);
router.get('/communication-methods', protect, getCommunicationMethods);

export default router;