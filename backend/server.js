import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import fs from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import dotenv from 'dotenv';

// Config
import config from './config/config.js';
import connectDB from './config/db.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';

// ES Module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express app
const app = express();

(async () => {
  try {
    // Connect to DB
    await connectDB();

    // Load models
    const modelsPath = path.join(__dirname, 'models');
    const modelFiles = fs.readdirSync(modelsPath).filter(file => file.endsWith('.js'));

    for (const file of modelFiles) {
      const fullPath = path.join(modelsPath, file);
      await import(pathToFileURL(fullPath).href);
    }

    // Seeder (only in development)
    if (process.env.NODE_ENV === 'development') {
      const { seedRoles } = await import('./seed/roles.seeder.js');
      await seedRoles();
      const { seedStaff } = await import('./seed/staff.seeder.js');
      await seedStaff();
    }

    // Middleware setup
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(mongoSanitize());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100
    });
    app.use(limiter);

    if (process.env.NODE_ENV !== 'production') {
      app.use(morgan('dev'));
    }

    // Routes
    app.use('/api/auth', authRoutes);

    // Error handling
    app.use(errorHandler);

    // Start server
    const PORT = config.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (err) {
    console.error('Fatal server error:', err);
    process.exit(1);
  }
})();
