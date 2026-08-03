const AppError = require('../utils/AppError');

module.exports = function notFound(req, res, next) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
};
