import express from 'express';
import {
  createCommunicationLog,
  getAllCommunicationLogs,
  getLogsByLeadOrCustomer,
  updateCommunicationLog,
  deleteCommunicationLog
} from '../controllers/communicationController.js';

import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();
router.use(protect);


router.post(
  '/createlog',
  checkRole('Admin', 'Sales Agent'),
  createCommunicationLog
);

router.get(
  '/',
  checkRole('Admin', 'Sales Agent'),
  getAllCommunicationLogs
);

router.get(
  '/byleadorcustomer/:id',
  checkRole('Admin', 'Sales Agent'),
  getLogsByLeadOrCustomer
);

router.put(
  '/:id',
  checkRole('Admin', 'Sales Agent'),
  updateCommunicationLog
);

router.delete(
  '/:id',
  checkRole('Admin'),
  deleteCommunicationLog
);

export default router;
