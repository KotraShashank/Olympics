const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  submitMatchResult,
  advanceToNextLevel,
  getMatchHistory,
  getRecentMatches,
  retryLevel,
} = require('../controllers/matchController');
const { matchResultValidator } = require('../validators/matchValidators');
const validate = require('../middleware/validate');

router.use(protect);

router.post('/submit', matchResultValidator, validate, submitMatchResult);
router.post('/advance/:sportId', advanceToNextLevel);
router.post('/retry/:sportId', retryLevel);
router.get('/history/:sportId', getMatchHistory);
router.get('/recent', getRecentMatches);

module.exports = router;