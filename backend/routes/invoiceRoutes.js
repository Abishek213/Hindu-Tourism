import express from 'express';
import {
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    downloadInvoicePDF
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/auth.js';
import { checkRole } from '../middleware/roleCheck.js';
import { handleInvoiceEmail } from '../middleware/invoiceEmailMiddleware.js';

const router = express.Router();

// Apply protection middleware to all routes
router.use(protect);

// Accountant-only routes for write operations
router.put('/:id', checkRole('Accountant'), handleInvoiceEmail, updateInvoice);
router.delete('/:id', checkRole('Accountant'), deleteInvoice);

// Read operations available to more roles
router.get('/', checkRole('Accountant', 'Admin'), getInvoices);
router.get('/:id', checkRole('Accountant', 'Admin'), getInvoiceById);
router.get('/:id/download', checkRole('Accountant', 'Admin'), downloadInvoicePDF);

export default router;