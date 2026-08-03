const sportService = require('../services/sportService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

exports.getAllSports = catchAsync(async (req, res) => {
  const data = await sportService.getAllSports();
  res.status(200).json(ApiResponse.success('Sports fetched successfully', data));
});

exports.getOlympicSports = catchAsync(async (req, res) => {
  const data = await sportService.getOlympicSports();
  res.status(200).json(ApiResponse.success('Olympic sports fetched', data));
});

exports.getSportById = catchAsync(async (req, res) => {
  const data = await sportService.getSportByIdAsResponse(req.params.id);
  res.status(200).json(ApiResponse.success('Sport fetched', data));
});