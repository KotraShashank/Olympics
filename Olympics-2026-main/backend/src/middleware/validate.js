const { validationResult } = require('express-validator');

// Mirrors: @Valid @RequestBody + GlobalExceptionHandler#handleValidationErrors
// Placed after the express-validator rule chain on a route.
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = {};
  errors.array().forEach((e) => {
    // keep the first message per field, same as Java's HashMap.put behaviour
    if (!formatted[e.path]) formatted[e.path] = e.msg;
  });

  return res.status(400).json({
    success: false,
    message: 'Validation failed',
    data: formatted,
    timestamp: new Date().toISOString(),
  });
};
