// Mirrors: com.sports.exception.BadRequestException / ResourceNotFoundException
// Instead of two exception classes, we use one class + a statusCode,
// since JS doesn't need @ResponseStatus annotations.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // marks "expected" errors vs bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
