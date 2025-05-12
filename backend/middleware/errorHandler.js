import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
};