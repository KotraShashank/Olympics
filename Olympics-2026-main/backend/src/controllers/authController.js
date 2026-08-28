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

exports.getProfile = catchAsync(async (req, res) => {
  const data = await authService.getProfile(req.user._id);
  res.status(200).json(ApiResponse.success('Profile retrieved successfully', data));
});

exports.updateProfile = catchAsync(async (req, res) => {
  const data = await authService.updateProfile(req.user._id, req.body);
  res.status(200).json(ApiResponse.success('Profile updated successfully', data));
});
