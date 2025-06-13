import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });
logger.debug(`Environment variables loaded from: ${envPath}`);

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    logger.warn(`Missing required environment variable: ${varName}`);
  }
}

export default {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_agency',
  JWT_SECRET: process.env.JWT_SECRET || (() => {
    logger.warn('Using default JWT secret - not recommended for production');
    return 'your-secret-key';
  })(),
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  NODE_ENV: process.env.NODE_ENV || 'development',
};