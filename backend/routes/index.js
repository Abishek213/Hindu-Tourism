// routes/index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import staffRoutes from './staffRoutes.js';
import leadRoutes from './leadRoutes.js';
import customerRoutes from './customerRoutes.js';
import packageRoutes from './packageRoutes.js';

const router = express.Router();

// Route configurations
router.use('/auth', authRoutes);
router.use('/staff', staffRoutes);
router.use('/lead', leadRoutes)
router.use('/customer', customerRoutes)
router.use('/package', packageRoutes)

// Mandatory default export
export default router;