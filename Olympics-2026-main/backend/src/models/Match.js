const mongoose = require('mongoose');
const { GAME_LEVELS } = require('../constants/levels');
const { MATCH_RESULTS } = require('../constants/enums');

// Mirrors: com.sports.model.Match
// Note: scoreDetails was a TEXT column in MySQL via a custom
// MapToJsonConverter. MongoDB stores JSON natively, so Schema.Types.Mixed
// replaces that entire converter class - no extra code needed.
const matchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: 'Sport', required: true },
  level: { type: String, enum: GAME_LEVELS, required: true },
  playerScore: { type: Number, min: 0 },
  opponentScore: { type: Number, min: 0 },
  result: { type: String, enum: MATCH_RESULTS, default: 'PENDING' },
  matchNumberInLevel: { type: Number, default: 0 },
  playedAt: { type: Date, default: Date.now },
  matchNotes: { type: String, maxlength: 500 },
  scoreDetails: { type: mongoose.Schema.Types.Mixed },
});

matchSchema.index({ user: 1, sport: 1, playedAt: -1 });

module.exports = mongoose.model('Match', matchSchema);
