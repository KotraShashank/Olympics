const leaderboardService = require('../services/leaderboardService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

exports.getLeaderboard = catchAsync(async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const data = await leaderboardService.getLeaderboard(limit);
  res.status(200).json(ApiResponse.success('Leaderboard fetched', data));
});