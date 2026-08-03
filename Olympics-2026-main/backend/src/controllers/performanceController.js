const performanceService = require('../services/performanceService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

// Mirrors: com.sports.controller.PerformanceController

exports.getAllProgress = catchAsync(async (req, res) => {
  const data = await performanceService.getAllProgressForUser(req.user._id);
  res.status(200).json(ApiResponse.success('All sport progress', data));
});

exports.getProgressBySport = catchAsync(async (req, res) => {
  const data = await performanceService.getProgressBySport(req.user._id, req.params.sportId);
  res.status(200).json(ApiResponse.success('Sport progress', data));
});

exports.getPerformanceSummary = catchAsync(async (req, res) => {
  const data = await performanceService.getPerformanceSummary(req.user._id, req.params.sportId);
  res.status(200).json(ApiResponse.success('Performance summary', data));
});

exports.getAllPerformance = catchAsync(async (req, res) => {
  const data = await performanceService.getAllPerformanceForUser(req.user._id);
  res.status(200).json(ApiResponse.success('All performance summaries', data));
});
