// services/fileUpload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploader = (config) => {
  const uploadsDir = path.join(__dirname, '../uploads', config.subdirectory);
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${config.prefix}-${uniqueSuffix}${ext}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, config.allowedTypes.includes(ext));
  };

  return multer({
    storage,
    fileFilter,
    limits: config.limits
  });
};

// Document upload (matches original 'uploads/document' structure)
export const documentUpload = createUploader({
  subdirectory: 'document', // Fixed to match original
  prefix: 'document',
  allowedTypes: ['.pdf', '.jpg', '.jpeg', '.png'], // Removed .doc/.docx to match original
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Brochure upload (existing functionality)
export const brochureUpload = createUploader({
  subdirectory: 'brochures',
  prefix: 'brochure',
  allowedTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
  limits: { fileSize: 5 * 1024 * 1024 }
});