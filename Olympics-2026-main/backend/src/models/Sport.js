const mongoose = require('mongoose');
const { SPORT_CATEGORIES, SPORT_SCORE_TYPES } = require('../constants/enums');

// Mirrors: com.sports.model.Sport
const sportSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, maxlength: 500 },
  category: { type: String, enum: SPORT_CATEGORIES, required: true },
  olympicSport: { type: Boolean, default: false },
  iconUrl: { type: String },
  matchesPerLevel: { type: Number, default: 5 },
  winsRequiredToAdvance: { type: Number, default: 3 },
  scoreType: { type: String, enum: SPORT_SCORE_TYPES },
});

module.exports = mongoose.model('Sport', sportSchema);
