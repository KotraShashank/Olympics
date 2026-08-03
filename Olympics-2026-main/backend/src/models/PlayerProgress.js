const mongoose = require('mongoose');
const { GAME_LEVELS } = require('../constants/levels');

// Mirrors: com.sports.model.PlayerProgress
const playerProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  currentLevel: { type: String, enum: GAME_LEVELS, default: 'LEVEL_1' },
  matchesPlayedInLevel: { type: Number, default: 0 },
  winsInLevel: { type: Number, default: 0 },
  totalMatches: { type: Number, default: 0 },
  totalWins: { type: Number, default: 0 },
  totalLosses: { type: Number, default: 0 },
  totalDraws: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  qualifiedForDistrict: { type: Boolean, default: false },
  qualifiedForState: { type: Boolean, default: false },
  qualifiedForOlympics: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
});

// Equivalent to: @UniqueConstraint(columnNames = {"user_id", "sport_id"})
playerProgressSchema.index({ user: 1, sport: 1 }, { unique: true });

module.exports = mongoose.model('PlayerProgress', playerProgressSchema);
