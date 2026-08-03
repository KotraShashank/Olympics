const User = require('../models/User');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/generateToken');

function buildAuthResponse(user, token) {
  return {
    token,
    tokenType: 'Bearer',
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

// Mirrors: AuthService#register
exports.register = async ({ username, email, password, fullName, dateOfBirth }) => {
  if (await User.findOne({ username })) {
    throw new AppError(`Username '${username}' is already taken`, 400);
  }
  if (await User.findOne({ email })) {
    throw new AppError(`Email '${email}' is already registered`, 400);
  }

  // password is hashed automatically by the pre('save') hook on the model,
  // equivalent to passwordEncoder.encode(request.getPassword()) in Java
  const user = await User.create({ username, email, password, fullName, dateOfBirth });
  const token = generateToken(user._id);

  return buildAuthResponse(user, token);
};

// Mirrors: AuthService#login (AuthenticationManager.authenticate replaced by comparePassword)
exports.login = async ({ username, password }) => {
  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid username or password', 401);
  }

  const token = generateToken(user._id);
  return buildAuthResponse(user, token);
};
