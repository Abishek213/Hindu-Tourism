import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

export default {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_agency',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
};