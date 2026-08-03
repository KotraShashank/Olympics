const ApiResponse = require('../utils/ApiResponse');

// Mirrors: com.sports.exception.GlobalExceptionHandler (@RestControllerAdvice)
// Every error in the app - thrown manually or by Mongoose - ends up here,
// exactly like Spring routes every exception through one @ExceptionHandler.
module.exports = function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred. Please try again.';

  // Mongoose duplicate key error (E11000) -> equivalent to a DB unique constraint violation
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    statusCode = 400;
    message = `${field} already exists`;
  }

  // Mongoose schema validation error -> mirrors MethodArgumentNotValidException handling,
  // returns a field -> message map exactly like the Java version does
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message;
    });
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      data: errors,
      timestamp: new Date().toISOString(),
    });
  }

  // Mongoose bad ObjectId (e.g. /api/sports/not-an-id) -> mirrors a bad path variable
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Don't leak internal error details for unexpected (non-operational) errors
  if (statusCode === 500 && !err.isOperational) {
    console.error('ERROR 💥', err);
    message = 'An unexpected error occurred. Please try again.';
  }

  res.status(statusCode).json(ApiResponse.error(message));
};
