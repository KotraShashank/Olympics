const PlayerProgress = require('../models/PlayerProgress');
const PerformanceSummary = require('../models/PerformanceSummary');
const sportService = require('./sportService');
const AppError = require('../utils/AppError');

// Mirrors: com.sports.service.PerformanceService

function mapProgress(progress, sport) {
  const matchesRemaining = sport.matchesPerLevel - progress.matchesPlayedInLevel;
  const winsNeeded = Math.max(0, sport.winsRequiredToAdvance - progress.winsInLevel);
  const winRate = progress.totalMatches > 0 ? (progress.totalWins / progress.totalMatches) * 100 : 0;

  return {
    id: progress._id,
    sportId: sport._id,
    sportName: sport.name,
    currentLevel: progress.currentLevel,
    matchesPlayedInLevel: progress.matchesPlayedInLevel,
    winsInLevel: progress.winsInLevel,
    totalMatches: progress.totalMatches,
    totalWins: progress.totalWins,
    totalLosses: progress.totalLosses,
    totalDraws: progress.totalDraws,
    winRate: Math.round(winRate * 100) / 100,
    qualifiedForDistrict: progress.qualifiedForDistrict,
    qualifiedForState: progress.qualifiedForState,
    qualifiedForOlympics: progress.qualifiedForOlympics,
    matchesRemainingInLevel: matchesRemaining,
    winsNeededToAdvance: winsNeeded,
  };
}

function mapSummary(summary) {
  return {
    id: summary._id,
    sportId: summary.sport._id,
    sportName: summary.sport.name,
    level: summary.level,
    matchesPlayed: summary.matchesPlayed,
    wins: summary.wins,
    losses: summary.losses,
    draws: summary.draws,
    totalScore: summary.totalScore,
    averageScore: summary.averageScore,
    winPercentage: summary.winPercentage,
    advancedToNextLevel: summary.advancedToNextLevel,
    completedAt: summary.completedAt,
  };
}

// Mirrors: PerformanceService#getProgressBySport
exports.getProgressBySport = async (userId, sportId) => {
  const sport = await sportService.getSportById(sportId);
  const progress = await PlayerProgress.findOne({ user: userId, sport: sportId });
  if (!progress) {
    throw new AppError('No progress found for this sport. Start playing matches first!', 404);
  }
  return mapProgress(progress, sport);
};

// Mirrors: PerformanceService#getAllProgressForUser
exports.getAllProgressForUser = async (userId) => {
  const list = await PlayerProgress.find({ user: userId }).populate('sport');
  return list.map((p) => mapProgress(p, p.sport));
};

// Mirrors: PerformanceService#getPerformanceSummary
exports.getPerformanceSummary = async (userId, sportId) => {
  await sportService.getSportById(sportId); // validates the sport exists, like Java does
  const list = await PerformanceSummary.find({ user: userId, sport: sportId })
    .sort({ level: 1 })
    .populate('sport');
  return list.map(mapSummary);
};

// Mirrors: PerformanceService#getAllPerformanceForUser
exports.getAllPerformanceForUser = async (userId) => {
  const list = await PerformanceSummary.find({ user: userId }).populate('sport');
  return list.map(mapSummary);
};
