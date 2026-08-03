const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

// Mirrors: com.sports.controller.AuthController

exports.register = catchAsync(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json(ApiResponse.success('User registered successfully', data));
});

exports.login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json(ApiResponse.success('Login successful', data));
});
