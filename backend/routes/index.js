// routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import staffRoutes from './staffRoutes.js';
import leadRoutes from './leadRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import guideRoutes from './guideRoutes.js';
import transportRoutes from './transportRoutes.js';
import communicationRoutes from './communicationRoutes.js';
import packageRoutes from './packageRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import documentRoutes from './documentRoutes.js';
import customerRoutes from './customerRoutes.js'; 


const router = express.Router();

// Route configurations
router.use('/auth', authRoutes);
router.use('/staff', staffRoutes);
router.use('/lead', leadRoutes)
router.use('/booking', bookingRoutes);
router.use('/guide', guideRoutes);
router.use('/transport', transportRoutes);
router.use('/communication', communicationRoutes);
router.use('/package', packageRoutes);
router.use('/payment', paymentRoutes);
router.use('/invoice', invoiceRoutes);
router.use('/document', documentRoutes);
router.use('/customer',customerRoutes)

// Mandatory default export
export default router;