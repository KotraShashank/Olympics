const Match = require('../models/Match');
const PlayerProgress = require('../models/PlayerProgress');
const PerformanceSummary = require('../models/PerformanceSummary');
const sportService = require('./sportService');
const scoreEvaluator = require('./matchScoreEvaluator');
const AppError = require('../utils/AppError');
const { GAME_LEVELS } = require('../constants/levels');

// Mirrors: com.sports.service.MatchService

async function getOrCreateProgress(userId, sport) {
  let progress = await PlayerProgress.findOne({ user: userId, sport: sport._id });
  if (!progress) {
    progress = await PlayerProgress.create({
      user: userId,
      sport: sport._id,
      currentLevel: 'LEVEL_1',
    });
  }
  return progress;
}

function isLevelCompleted(progress, sport) {
  return progress.matchesPlayedInLevel >= sport.matchesPerLevel;
}

function determineResult(playerScore, opponentScore) {
  if (playerScore > opponentScore) return 'WIN';
  if (playerScore < opponentScore) return 'LOSS';
  return 'DRAW';
}

function mapMatch(match, sport) {
  return {
    id: match._id,
    sportId: sport._id,
    sportName: sport.name,
    level: match.level,
    playerScore: match.playerScore,
    opponentScore: match.opponentScore,
    result: match.result,
    matchNumberInLevel: match.matchNumberInLevel,
    playedAt: match.playedAt,
    matchNotes: match.matchNotes,
    scoreDetails: match.scoreDetails,
  };
}

// Mirrors: MatchService#submitMatchResult
exports.submitMatchResult = async (userId, request) => {
  const { sportId, playerScore: rawPlayerScore, opponentScore: rawOpponentScore, scoreDetails, matchNotes } = request;

  const sport = await sportService.getSportById(sportId);
  const progress = await getOrCreateProgress(userId, sport);

  if (isLevelCompleted(progress, sport)) {
    throw new AppError(
      `All matches for level ${progress.currentLevel} are complete. Please advance to the next level.`,
      400
    );
  }

  let playerScore;
  let opponentScore;
  let result;

  if (scoreDetails && Object.keys(scoreDetails).length > 0 && sport.scoreType) {
    const evalResult = scoreEvaluator.evaluate(sport.scoreType, scoreDetails);
    playerScore = evalResult.playerScore;
    opponentScore = evalResult.opponentScore;
    result = evalResult.result;
  } else {
    playerScore = rawPlayerScore ?? 0;
    opponentScore = rawOpponentScore ?? 0;
    result = determineResult(playerScore, opponentScore);
  }

  const match = await Match.create({
    user: userId,
    sport: sport._id,
    level: progress.currentLevel,
    playerScore,
    opponentScore,
    result,
    matchNumberInLevel: progress.matchesPlayedInLevel + 1,
    matchNotes,
    scoreDetails,
  });

  progress.matchesPlayedInLevel += 1;
  progress.totalMatches += 1;
  progress.totalScore += playerScore;

  if (result === 'WIN') {
    progress.winsInLevel += 1;
    progress.totalWins += 1;
  } else if (result === 'LOSS') {
    progress.totalLosses += 1;
  } else if (result === 'DRAW') {
    progress.totalDraws += 1;
  }

  await progress.save();

  return mapMatch(match, sport);
};

// Mirrors: MatchService#advanceToNextLevel
exports.advanceToNextLevel = async (userId, sportId) => {
  const progress = await PlayerProgress.findOne({ user: userId, sport: sportId });
  if (!progress) throw new AppError('No progress found for this sport', 404);

  const sport = await sportService.getSportById(sportId);

  if (!isLevelCompleted(progress, sport)) {
    throw new AppError('You have not completed all matches in the current level yet.', 400);
  }

  if (progress.winsInLevel < sport.winsRequiredToAdvance) {
    throw new AppError(
      `You need ${sport.winsRequiredToAdvance} wins to advance. You have ${progress.winsInLevel} wins.`,
      400
    );
  }

  // Snapshot the level just completed into PerformanceSummary (upsert = findOrCreate + save)
  const played = progress.matchesPlayedInLevel;
  const wins = progress.winsInLevel;
  const avgScore = progress.totalMatches > 0 ? progress.totalScore / progress.totalMatches : 0;
  const winPct = played > 0 ? (wins / played) * 100 : 0;

  await PerformanceSummary.findOneAndUpdate(
    { user: userId, sport: sportId, level: progress.currentLevel },
    {
      user: userId,
      sport: sportId,
      level: progress.currentLevel,
      matchesPlayed: played,
      wins,
      losses: progress.totalLosses,
      draws: progress.totalDraws,
      totalScore: progress.totalScore,
      averageScore: avgScore,
      winPercentage: winPct,
      advancedToNextLevel: true,
      completedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const currentIndex = GAME_LEVELS.indexOf(progress.currentLevel);
  if (currentIndex < GAME_LEVELS.length - 1) {
    const nextLevel = GAME_LEVELS[currentIndex + 1];
    progress.currentLevel = nextLevel;
    progress.matchesPlayedInLevel = 0;
    progress.winsInLevel = 0;

    if (nextLevel === 'DISTRICT') progress.qualifiedForDistrict = true;
    if (nextLevel === 'STATE') progress.qualifiedForState = true;
    if (nextLevel === 'OLYMPICS') progress.qualifiedForOlympics = true;
  }

  await progress.save();
  return progress;
};

// Mirrors: MatchService#getMatchHistory
// Extended with optional pagination + search (new feature, not in the Java version).
// Backward compatible: calling with no options still returns a plain array,
// exactly like before, so the existing frontend keeps working unchanged.
exports.getMatchHistory = async (userId, sportId, options = {}) => {
  const { page, limit, search } = options;

  const filter = { user: userId, sport: sportId };
  if (search) {
    filter.matchNotes = { $regex: search, $options: 'i' };
  }

  const baseQuery = Match.find(filter).sort({ playedAt: -1 }).populate('sport');

  if (page && limit) {
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [matches, total] = await Promise.all([
      baseQuery.skip(skip).limit(limitNum),
      Match.countDocuments(filter),
    ]);

    return {
      matches: matches.map((m) => mapMatch(m, m.sport)),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  const matches = await baseQuery;
  return matches.map((m) => mapMatch(m, m.sport));
};

// Mirrors: MatchService#getRecentMatches
exports.getRecentMatches = async (userId) => {
  const matches = await Match.find({ user: userId }).sort({ playedAt: -1 }).populate('sport');
  return matches.map((m) => mapMatch(m, m.sport));
};
