import express from 'express';
import {
  getAllServices,
  getActiveServices,
  getServiceById,
  createService,
  updateService,
  updateServiceStatus,
  deleteService,
  getServicesByCategory,
  getServiceStats
} from '../controllers/optionalServiceController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/active', getActiveServices);
router.get('/category/:category', getServicesByCategory);

// Protected routes (require authentication)
router.use(protect);

// Admin/Staff routes (require appropriate role)
router.get('/',
  checkRole('Admin', 'Sales Agent', 'Operation Team'),
  getAllServices
);

router.get('/stats',
  checkRole('Admin', 'Operation Team'),
  getServiceStats
);

router.get('/:id',
  checkRole('Admin', 'Sales Agent', 'Operation Team'),
  getServiceById
);

router.post('/',
  checkRole('Admin', 'Operation Team'),
  createService
);

router.put('/:id',
  checkRole('Admin', 'Operation Team'),
  updateService
);

router.put('/:id/status',
  checkRole('Admin', 'Sales Agent', 'Operation Team'),
  updateServiceStatus
);

router.delete('/:id',
  checkRole('Admin', 'Operation Team'),
  deleteService
);

export default router;