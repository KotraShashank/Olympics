const mongoose = require('mongoose');
const { GAME_LEVELS } = require('../constants/levels');

// Mirrors: com.sports.model.PerformanceSummary
const performanceSummarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  level: { type: String, enum: GAME_LEVELS, required: true },
  matchesPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  winPercentage: { type: Number, default: 0 },
  advancedToNextLevel: { type: Boolean, default: false },
  completedAt: { type: Date },
});

// Equivalent to: @UniqueConstraint(columnNames = {"user_id", "sport_id", "level"})
performanceSummarySchema.index({ user: 1, sport: 1, level: 1 }, { unique: true });

module.exports = mongoose.model('PerformanceSummary', performanceSummarySchema);
