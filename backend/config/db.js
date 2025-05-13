import mongoose from 'mongoose';
import config from './config.js';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    logger.debug(`MongoDB connection details: 
      - Database: ${conn.connection.name}
      - Port: ${conn.connection.port}
      - Model count: ${Object.keys(mongoose.models).length}`);
    
    // Connection event listeners
    conn.connection.on('connected', () => {
      logger.debug('Mongoose default connection open');
    });
    
    conn.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });
    
    conn.connection.on('disconnected', () => {
      logger.warn('Mongoose default connection disconnected');
    });
    
    return conn;
  } catch (error) {
    logger.error('MongoDB connection failed:', {
      message: error.message,
      stack: error.stack,
      config: {
        connectionString: config.MONGODB_URI.replace(/\/\/.*@/, '//****:****@'),
        timeout: '5s'
      }
    });
    process.exit(1);
  }
};

export default connectDB;