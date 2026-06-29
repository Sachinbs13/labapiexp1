const {
  sendError,
  formatMongooseErrors,
  handleDuplicateKeyError,
} = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  if (err.message && err.message.includes('not allowed by CORS')) {
    return sendError(res, 403, 'CORS policy violation', [err.message]);
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return sendError(res, 400, 'Invalid student ID', [
      'Please provide a valid MongoDB ObjectId',
    ]);
  }

  if (err.code === 11000) {
    const duplicateError = handleDuplicateKeyError(err);
    return sendError(
      res,
      duplicateError.statusCode,
      duplicateError.message,
      duplicateError.errors
    );
  }

  if (err.name === 'ValidationError') {
    return sendError(res, 422, 'Validation failed', formatMongooseErrors(err));
  }

  if (err.statusCode) {
    return sendError(res, err.statusCode, err.message, err.errors || [err.message]);
  }

  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  return sendError(res, 500, message, [
    process.env.NODE_ENV === 'production'
      ? 'Something went wrong on the server'
      : err.message,
  ]);
};

module.exports = errorHandler;
