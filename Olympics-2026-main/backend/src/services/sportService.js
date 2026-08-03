const Sport = require('../models/Sport');
const AppError = require('../utils/AppError');

// Mirrors: com.sports.service.SportService
// Maps raw MongoDB documents (_id) to the same shape the frontend expects (id) -
// exactly like matchService and performanceService already do.
function mapToResponse(sport) {
  return {
    id: sport._id,
    name: sport.name,
    description: sport.description,
    category: sport.category,
    olympicSport: sport.olympicSport,
    iconUrl: sport.iconUrl,
    matchesPerLevel: sport.matchesPerLevel,
    winsRequiredToAdvance: sport.winsRequiredToAdvance,
    scoreType: sport.scoreType,
  };
}

exports.getAllSports = async () => {
  const sports = await Sport.find();
  return sports.map(mapToResponse);
};

exports.getOlympicSports = async () => {
  const sports = await Sport.find({ olympicSport: true });
  return sports.map(mapToResponse);
};

exports.getSportById = async (id) => {
  const sport = await Sport.findById(id);
  if (!sport) throw new AppError(`Sport not found with id: ${id}`, 404);
  return sport; // internal use (other services need the real Mongoose doc, e.g. sport.matchesPerLevel)
};

exports.getSportByIdAsResponse = async (id) => {
  const sport = await exports.getSportById(id);
  return mapToResponse(sport);
};