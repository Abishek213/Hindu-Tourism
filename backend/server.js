import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // if using cookies for authentication
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));