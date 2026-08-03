const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  submitMatchResult,
  advanceToNextLevel,
  getMatchHistory,
  getRecentMatches,
} = require('../controllers/matchController');
const { matchResultValidator } = require('../validators/matchValidators');
const validate = require('../middleware/validate');

// Mirrors: SecurityConfig -> .anyRequest().authenticated()
router.use(protect);

router.post('/submit', matchResultValidator, validate, submitMatchResult);
router.post('/advance/:sportId', advanceToNextLevel);
router.get('/history/:sportId', getMatchHistory);
router.get('/recent', getRecentMatches);

module.exports = router;
