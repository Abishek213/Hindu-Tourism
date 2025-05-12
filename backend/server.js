// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import cookieParser from 'cookie-parser';
// import rateLimit from 'express-rate-limit';
// import mongoSanitize from 'express-mongo-sanitize';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Config
// import config from './config/config.js';
// import connectDB from './config/db.js';

// // Middleware
// import errorHandler from './middleware/errorHandler.js';

// // Routes
// import authRoutes from './routes/authRoutes.js';

// // ES Module fix for __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Initialize Express
// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(cors());
// app.use(helmet());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(mongoSanitize());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100
// });
// app.use(limiter);

// // Logging
// if (process.env.NODE_ENV !== 'production') {
//   app.use(morgan('dev'));
// }

// // Routes
// app.use('/api/auth', authRoutes);

// // Error handling
// app.use(errorHandler);

// // Start server
// const PORT = config.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

// Config
import config from './config/config.js';
import connectDB from './config/db.js';

// Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Logging
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
  console.log(`Server running on port ${PORT}`);
});