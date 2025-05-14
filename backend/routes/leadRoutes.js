import express from 'express';
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  convertLeadToCustomer,
  addCommunicationLog,
  searchLeads
} from '../controllers/leadController.js';
import { protect, checkLeadAccess } from '../middleware/auth.js';
import { validateLead } from '../utils/validators.js';

const router = express.Router();

router.post('/', protect, checkLeadAccess, validateLead, createLead);
router.get('/', protect, checkLeadAccess, getAllLeads);
router.get('/search', protect, checkLeadAccess, searchLeads);
router.get('/:id', protect, checkLeadAccess, getLeadById);
router.put('/:id', protect, checkLeadAccess, updateLead);
router.post('/:id/convert', protect, checkLeadAccess, convertLeadToCustomer);
router.post('/:id/logs', protect, checkLeadAccess, addCommunicationLog);


export default router;