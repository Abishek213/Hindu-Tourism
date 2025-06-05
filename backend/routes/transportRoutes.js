import express from 'express';
import {
  createTransport,
  getTransports,
  updateTransportStatus,
  checkTransportStatus,
  assignTransport
} from '../controllers/transportController.js';

import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
const router = express.Router();
router.use(protect);

router.post(
  '/create',
  checkRole('Operation Team', 'Admin'),
  createTransport
);

router.get('/', protect, getTransports);

router.put(
  '/:id/status',
  checkRole('Admin','Operation Team'),
  updateTransportStatus
);

router.post('/checkstatus', checkRole('Admin','Operation Team'), checkTransportStatus);

router.put('/:id/assigntransport',
    checkRole('Admin', 'Operation Team'),
    assignTransport
);

export default router;
