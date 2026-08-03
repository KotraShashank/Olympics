const mongoose = require('mongoose');
const PlayerProgress = require('../models/PlayerProgress');

exports.getLeaderboard = async (limit = 10) => {
  const results = await PlayerProgress.aggregate([
    {
      $group: {
        _id: '$user',
        totalWins: { $sum: '$totalWins' },
        totalMatches: { $sum: '$totalMatches' },
        totalLosses: { $sum: '$totalLosses' },
        sportsPlayed: { $sum: 1 },
        olympicQualifications: {
          $sum: { $cond: ['$qualifiedForOlympics', 1, 0] },
        },
      },
    },
    { $match: { totalMatches: { $gt: 0 } } },
    { $sort: { totalWins: -1, totalMatches: 1 } },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    { $unwind: '$userInfo' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        username: '$userInfo.username',
        totalWins: 1,
        totalMatches: 1,
        totalLosses: 1,
        sportsPlayed: 1,
        olympicQualifications: 1,
        winRate: {
          $cond: [
            { $eq: ['$totalMatches', 0] },
            0,
            {
              $round: [
                { $multiply: [{ $divide: ['$totalWins', '$totalMatches'] }, 100] },
                2,
              ],
            },
          ],
        },
      },
    },
  ]);

  return results.map((r, index) => ({ rank: index + 1, ...r }));
};