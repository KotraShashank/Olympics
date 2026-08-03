// Sport-specific scoring form configurations
// Each entry maps a SportScoreType → form field definitions + display formatters

const f = (key, label, type = 'number', opts = {}) => ({ key, label, type, ...opts });

export const SCORE_FORM_CONFIGS = {

  CRICKET: {
    icon: '🏏',
    title: 'Cricket',
    description: 'Most runs wins. Enter runs, wickets lost, and overs played.',
    extraFields: [
      f('tossWon',  'Won the Toss?',     'boolean'),
      f('choseTo',  'Elected to',        'select',  { options: [{ value: 'BAT', label: 'Bat First' }, { value: 'BOWL', label: 'Bowl First' }] }),
    ],
    playerFields: [
      f('playerRuns',    'Runs Scored',    'number',  { placeholder: '245', min: 0, hint: 'Total innings runs' }),
      f('playerWickets', 'Wickets Lost',   'number',  { placeholder: '5',   min: 0, max: 10, hint: '0–10' }),
      f('playerOvers',   'Overs Played',   'decimal', { placeholder: '50.0', min: 0, hint: 'e.g. 47.3' }),
    ],
    opponentFields: [
      f('opponentRuns',    'Runs Scored',  'number',  { placeholder: '210', min: 0 }),
      f('opponentWickets', 'Wickets Lost', 'number',  { placeholder: '9',   min: 0, max: 10 }),
      f('opponentOvers',   'Overs Played', 'decimal', { placeholder: '47.3', min: 0 }),
    ],
    getPlayerDisplay:   (d) => (d.playerRuns != null)   ? `${d.playerRuns}/${d.playerWickets ?? 0}`   : '—',
    getOpponentDisplay: (d) => (d.opponentRuns != null)  ? `${d.opponentRuns}/${d.opponentWickets ?? 0}` : '—',
  },

  KABADDI: {
    icon: '🤼',
    title: 'Kabaddi',
    description: 'Total = Raid + Tackle + Bonus points. Highest wins.',
    extraFields: [],
    playerFields: [
      f('playerRaidPoints',   'Raid Points',   'number', { placeholder: '18', min: 0 }),
      f('playerTacklePoints', 'Tackle Points', 'number', { placeholder: '12', min: 0 }),
      f('playerBonusPoints',  'Bonus Points',  'number', { placeholder: '2',  min: 0 }),
    ],
    opponentFields: [
      f('opponentRaidPoints',   'Raid Points',   'number', { placeholder: '15', min: 0 }),
      f('opponentTacklePoints', 'Tackle Points', 'number', { placeholder: '10', min: 0 }),
      f('opponentBonusPoints',  'Bonus Points',  'number', { placeholder: '1',  min: 0 }),
    ],
    getPlayerDisplay:   (d) => { const t = (d.playerRaidPoints||0)+(d.playerTacklePoints||0)+(d.playerBonusPoints||0); return t > 0 ? `${t} pts` : '—'; },
    getOpponentDisplay: (d) => { const t = (d.opponentRaidPoints||0)+(d.opponentTacklePoints||0)+(d.opponentBonusPoints||0); return t > 0 ? `${t} pts` : '—'; },
  },

  POINTS: {
    icon: '🏀',
    title: 'Points',
    description: 'Highest points total wins.',
    extraFields: [],
    playerFields:   [ f('playerPoints',   'Your Points',      'number', { placeholder: '21', min: 0 }) ],
    opponentFields: [ f('opponentPoints', 'Opponent Points',  'number', { placeholder: '18', min: 0 }) ],
    getPlayerDisplay:   (d) => d.playerPoints   != null ? `${d.playerPoints}`   : '—',
    getOpponentDisplay: (d) => d.opponentPoints != null ? `${d.opponentPoints}` : '—',
  },

  GOALS: {
    icon: '⚽',
    title: 'Goals',
    description: 'Most goals wins.',
    extraFields: [],
    playerFields:   [ f('playerGoals',   'Your Goals',     'number', { placeholder: '2', min: 0 }) ],
    opponentFields: [ f('opponentGoals', 'Opponent Goals', 'number', { placeholder: '1', min: 0 }) ],
    getPlayerDisplay:   (d) => d.playerGoals   != null ? `${d.playerGoals}`   : '—',
    getOpponentDisplay: (d) => d.opponentGoals != null ? `${d.opponentGoals}` : '—',
  },

  SETS: {
    icon: '🏸',
    title: 'Sets',
    description: 'Most sets won decides the match.',
    extraFields: [],
    playerFields: [
      f('playerSets',   'Sets Won',       'number', { placeholder: '2', min: 0, max: 5 }),
      f('playerPoints', 'Total Points',   'number', { placeholder: '42', min: 0, hint: 'All sets combined' }),
    ],
    opponentFields: [
      f('opponentSets',   'Sets Won',     'number', { placeholder: '1', min: 0, max: 5 }),
      f('opponentPoints', 'Total Points', 'number', { placeholder: '36', min: 0 }),
    ],
    getPlayerDisplay:   (d) => d.playerSets   != null ? `${d.playerSets} sets`   : '—',
    getOpponentDisplay: (d) => d.opponentSets != null ? `${d.opponentSets} sets` : '—',
  },

  TIME_LOWER_WINS: {
    icon: '⏱️',
    title: 'Time Trial',
    description: 'Fastest time wins. Enter time in seconds (e.g. 9.85 or 3723.4 for marathon).',
    extraFields: [],
    playerFields:   [ f('playerTimeSeconds',   'Your Time (sec)',      'decimal', { placeholder: '9.85',  min: 0 }) ],
    opponentFields: [ f('opponentTimeSeconds', 'Opponent Time (sec)',  'decimal', { placeholder: '10.12', min: 0 }) ],
    getPlayerDisplay:   (d) => d.playerTimeSeconds   != null ? `${d.playerTimeSeconds}s`   : '—',
    getOpponentDisplay: (d) => d.opponentTimeSeconds != null ? `${d.opponentTimeSeconds}s` : '—',
  },

  DISTANCE_HIGHER_WINS: {
    icon: '📏',
    title: 'Distance',
    description: 'Farthest distance wins. Enter in centimetres (e.g. 820 cm = 8.20 m).',
    extraFields: [],
    playerFields:   [ f('playerDistanceCm',   'Your Distance (cm)',     'decimal', { placeholder: '820.5', min: 0 }) ],
    opponentFields: [ f('opponentDistanceCm', 'Opponent Distance (cm)', 'decimal', { placeholder: '795.0', min: 0 }) ],
    getPlayerDisplay:   (d) => d.playerDistanceCm   != null ? `${(d.playerDistanceCm/100).toFixed(2)} m`   : '—',
    getOpponentDisplay: (d) => d.opponentDistanceCm != null ? `${(d.opponentDistanceCm/100).toFixed(2)} m` : '—',
  },

  COMBAT: {
    icon: '🥊',
    title: 'Combat',
    description: 'Points from rounds / techniques. KO or Ippon = instant win.',
    extraFields: [
      f('endedByKO',    'Won by KO / Ippon?', 'boolean', { hint: 'Check if you knocked out or got an ippon' }),
    ],
    playerFields:   [ f('playerPoints',   'Points Scored', 'number', { placeholder: '12', min: 0 }) ],
    opponentFields: [ f('opponentPoints', 'Points Scored', 'number', { placeholder: '8',  min: 0 }) ],
    getPlayerDisplay:   (d) => d.endedByKO ? 'KO! 🥊' : (d.playerPoints   != null ? `${d.playerPoints} pts`   : '—'),
    getOpponentDisplay: (d) =>                            (d.opponentPoints != null ? `${d.opponentPoints} pts` : '—'),
  },

  ACCURACY: {
    icon: '🎯',
    title: 'Accuracy',
    description: 'Highest target score wins. X-rings used as tiebreaker.',
    extraFields: [],
    playerFields: [
      f('playerScore',     'Target Score',      'number', { placeholder: '290', min: 0 }),
      f('playerBullseyes', 'Bullseyes / X-ring', 'number', { placeholder: '5',   min: 0, hint: 'Tiebreaker' }),
    ],
    opponentFields: [
      f('opponentScore',     'Target Score',      'number', { placeholder: '285', min: 0 }),
      f('opponentBullseyes', 'Bullseyes / X-ring', 'number', { placeholder: '3',   min: 0 }),
    ],
    getPlayerDisplay:   (d) => d.playerScore   != null ? `${d.playerScore} pts`   : '—',
    getOpponentDisplay: (d) => d.opponentScore != null ? `${d.opponentScore} pts` : '—',
  },

  ARTISTIC_SCORE: {
    icon: '🤸',
    title: "Judge's Score",
    description: 'Combined judges score. Highest wins. Use decimal (e.g. 15.8).',
    extraFields: [],
    playerFields:   [ f('playerScore',   "Your Score",      'decimal', { placeholder: '15.8', min: 0 }) ],
    opponentFields: [ f('opponentScore', 'Opponent Score',  'decimal', { placeholder: '14.9', min: 0 }) ],
    getPlayerDisplay:   (d) => d.playerScore   != null ? `${d.playerScore}`   : '—',
    getOpponentDisplay: (d) => d.opponentScore != null ? `${d.opponentScore}` : '—',
  },

  WEIGHTLIFTING: {
    icon: '🏋️',
    title: 'Weightlifting',
    description: 'Snatch + Clean & Jerk combined total. Heaviest wins.',
    extraFields: [],
    playerFields: [
      f('playerSnatch',    'Snatch (kg)',       'decimal', { placeholder: '165.0', min: 0 }),
      f('playerCleanJerk', 'Clean & Jerk (kg)', 'decimal', { placeholder: '205.0', min: 0 }),
    ],
    opponentFields: [
      f('opponentSnatch',    'Snatch (kg)',       'decimal', { placeholder: '160.0', min: 0 }),
      f('opponentCleanJerk', 'Clean & Jerk (kg)', 'decimal', { placeholder: '200.0', min: 0 }),
    ],
    getPlayerDisplay:   (d) => { const t = (d.playerSnatch||0)+(d.playerCleanJerk||0);   return t > 0 ? `${t} kg` : '—'; },
    getOpponentDisplay: (d) => { const t = (d.opponentSnatch||0)+(d.opponentCleanJerk||0); return t > 0 ? `${t} kg` : '—'; },
  },
};

export const getConfig = (scoreType) => SCORE_FORM_CONFIGS[scoreType] || SCORE_FORM_CONFIGS.POINTS;
