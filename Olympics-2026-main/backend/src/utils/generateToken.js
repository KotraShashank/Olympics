const jwt = require('jsonwebtoken');

// Mirrors: com.sports.security.JwtTokenProvider#buildToken
module.exports = function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};
