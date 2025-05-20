// routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import staffRoutes from './staffRoutes.js';
import leadRoutes from './leadRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import guideRoutes from './guideRoutes.js';
import transportRoutes from './transportRoutes.js';
import communicationRoutes from './communicationRoutes.js';

const router = express.Router();

// Route configurations
router.use('/auth', authRoutes);
router.use('/staff', staffRoutes);
router.use('/lead', leadRoutes)
router.use('/booking', bookingRoutes);
router.use('/guide', guideRoutes);
router.use('/transport', transportRoutes);
router.use('/communication', communicationRoutes);

// Mandatory default export
export default router;