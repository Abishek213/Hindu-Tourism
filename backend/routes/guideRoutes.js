import express from 'express';
import {
  createGuide,
  getGuides,
  updateGuideStatus,
  checkGuideStatus,
  assignGuide
} from '../controllers/guideController.js';

import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
const router = express.Router();
router.use(protect);

router.post(
  '/create',
  checkRole('Operation Team', 'Admin'),
  createGuide
);

router.get('/', getGuides);

router.put(
  '/:id/status',
  checkRole('Operation Team','Admin'),
  updateGuideStatus
);

router.post(
    '/checkstatus',
    checkRole('Operation Team','Admin'),
    checkGuideStatus
)

router.put('/:id/assignguide',
    checkRole('Admin', 'Operation Team'),
    assignGuide
);

export default router;
