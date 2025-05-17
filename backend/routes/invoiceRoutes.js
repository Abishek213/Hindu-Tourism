import express from 'express';
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    downloadInvoicePDF
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

// Accountant-only routes
router.use(checkRole('Accountant'));

router.route('/')
    .post(createInvoice)
    .get(getInvoices);

router.route('/:id')
    .get(getInvoiceById)
    .put(updateInvoice)
    .delete(deleteInvoice);

router.get('/:id/download', downloadInvoicePDF);

export default router;