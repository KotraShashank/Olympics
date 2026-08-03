const matchService = require('../services/matchService');
const performanceService = require('../services/performanceService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

// Mirrors: com.sports.controller.MatchController
// Note: req.user._id replaces resolveUserId(userDetails) - the auth
// middleware already looked the user up and attached it to req.user.

exports.submitMatchResult = catchAsync(async (req, res) => {
  const data = await matchService.submitMatchResult(req.user._id, req.body);
  res.status(200).json(ApiResponse.success('Match result recorded', data));
});

exports.advanceToNextLevel = catchAsync(async (req, res) => {
  await matchService.advanceToNextLevel(req.user._id, req.params.sportId);
  const progress = await performanceService.getProgressBySport(req.user._id, req.params.sportId);
  res
    .status(200)
    .json(ApiResponse.success(`Advanced to next level: ${progress.currentLevel}`, progress));
});

exports.getMatchHistory = catchAsync(async (req, res) => {
  const { page, limit, search } = req.query;
  const data = await matchService.getMatchHistory(req.user._id, req.params.sportId, {
    page,
    limit,
    search,
  });
  res.status(200).json(ApiResponse.success('Match history', data));
});

exports.getRecentMatches = catchAsync(async (req, res) => {
  const data = await matchService.getRecentMatches(req.user._id);
  res.status(200).json(ApiResponse.success('Recent matches', data));
});
