// Mirrors: com.sports.service.MatchScoreEvaluator
// Same idea: different sports score differently (cricket = runs, swimming =
// time where lower wins, gymnastics = judge scores, etc). One evaluate()
// function takes the sport's scoreType + a flexible key/value score object
// and returns { playerScore, opponentScore, result }.

function getNum(d, key) {
  const v = d[key];
  if (v === undefined || v === null || v === '') return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
}

function getBool(d, key) {
  const v = d[key];
  if (v === undefined || v === null) return false;
  if (typeof v === 'boolean') return v;
  return String(v).trim().toLowerCase() === 'true';
}

function compareHigher(p, o) {
  if (p > o) return 'WIN';
  if (p < o) return 'LOSS';
  return 'DRAW';
}

function evaluateCricket(d) {
  const p = getNum(d, 'playerRuns');
  const o = getNum(d, 'opponentRuns');
  return { playerScore: p, opponentScore: o, result: compareHigher(p, o) };
}

function evaluateKabaddi(d) {
  const p = getNum(d, 'playerRaidPoints') + getNum(d, 'playerTacklePoints') + getNum(d, 'playerBonusPoints');
  const o = getNum(d, 'opponentRaidPoints') + getNum(d, 'opponentTacklePoints') + getNum(d, 'opponentBonusPoints');
  return { playerScore: p, opponentScore: o, result: compareHigher(p, o) };
}

// Lower time = WIN. Stored as time * 10 (one decimal preserved as int), same as Java version.
function evaluateTimeLowerWins(d) {
  const pt = getNum(d, 'playerTimeSeconds');
  const ot = getNum(d, 'opponentTimeSeconds');
  const result = pt < ot ? 'WIN' : pt > ot ? 'LOSS' : 'DRAW';
  return { playerScore: Math.trunc(pt * 10), opponentScore: Math.trunc(ot * 10), result };
}

// Farther distance = WIN. Stored in cm.
function evaluateDistanceHigherWins(d) {
  const p = Math.trunc(getNum(d, 'playerDistanceCm'));
  const o = Math.trunc(getNum(d, 'opponentDistanceCm'));
  return { playerScore: p, opponentScore: o, result: compareHigher(p, o) };
}

function evaluateCombat(d) {
  const ko = getBool(d, 'endedByKO') || getBool(d, 'endedByIppon');
  if (ko) return { playerScore: 10, opponentScore: 0, result: 'WIN' };
  const p = getNum(d, 'playerPoints');
  const o = getNum(d, 'opponentPoints');
  return { playerScore: p, opponentScore: o, result: compareHigher(p, o) };
}

// Artistic / gymnastics / diving scores stored as score * 10.
function evaluateArtistic(d) {
  const p = getNum(d, 'playerScore');
  const o = getNum(d, 'opponentScore');
  const result = p > o ? 'WIN' : p < o ? 'LOSS' : 'DRAW';
  return { playerScore: Math.trunc(p * 10), opponentScore: Math.trunc(o * 10), result };
}

function evaluateWeightlifting(d) {
  const p = getNum(d, 'playerSnatch') + getNum(d, 'playerCleanJerk');
  const o = getNum(d, 'opponentSnatch') + getNum(d, 'opponentCleanJerk');
  const result = p > o ? 'WIN' : p < o ? 'LOSS' : 'DRAW';
  return { playerScore: Math.trunc(p), opponentScore: Math.trunc(o), result };
}

function evaluateGoals(d) {
  const p = getNum(d, 'playerGoals');
  const o = getNum(d, 'opponentGoals');
  return { playerScore: p, opponentScore: o, result: compareHigher(p, o) };
}

function evaluateSets(d) {
  const p = getNum(d, 'playerSets');
  const o = getNum(d, 'opponentSets');
  return { playerScore: p, opponentScore: o, result: compareHigher(p, o) };
}

function evaluateAccuracy(d) {
  const p = getNum(d, 'playerScore');
  const o = getNum(d, 'opponentScore');
  return { playerScore: p, opponentScore: o, result: compareHigher(p, o) };
}

function evaluateGenericPoints(d) {
  let p = 0;
  let o = 0;
  for (const k of ['playerPoints', 'playerGoals', 'playerSets', 'playerScore']) {
    if (d[k] !== undefined) { p = getNum(d, k); break; }
  }
  for (const k of ['opponentPoints', 'opponentGoals', 'opponentSets', 'opponentScore']) {
    if (d[k] !== undefined) { o = getNum(d, k); break; }
  }
  return { playerScore: p, opponentScore: o, result: compareHigher(p, o) };
}

const EVALUATORS = {
  CRICKET: evaluateCricket,
  KABADDI: evaluateKabaddi,
  TIME_LOWER_WINS: evaluateTimeLowerWins,
  DISTANCE_HIGHER_WINS: evaluateDistanceHigherWins,
  COMBAT: evaluateCombat,
  ARTISTIC_SCORE: evaluateArtistic,
  WEIGHTLIFTING: evaluateWeightlifting,
  GOALS: evaluateGoals,
  SETS: evaluateSets,
  ACCURACY: evaluateAccuracy,
  POINTS: evaluateGenericPoints,
};

function evaluate(scoreType, scoreDetails) {
  if (!scoreDetails || Object.keys(scoreDetails).length === 0) {
    return { playerScore: 0, opponentScore: 0, result: 'DRAW' };
  }
  const fn = EVALUATORS[scoreType] || evaluateGenericPoints;
  return fn(scoreDetails);
}

module.exports = { evaluate };
