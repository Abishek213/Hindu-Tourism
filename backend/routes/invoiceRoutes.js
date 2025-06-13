import express from 'express';
import {
    getInvoices,
    getInvoiceById,
    updateInvoiceStatus,
    downloadInvoicePDF
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);

router.get('/', checkRole('Accountant', 'Admin'), getInvoices);
router.get('/:id', checkRole('Accountant', 'Admin'), getInvoiceById);
router.put('/:id/status', checkRole('Accountant'), updateInvoiceStatus);
router.get('/:id/download', checkRole('Accountant', 'Admin'), downloadInvoicePDF);

export default router;