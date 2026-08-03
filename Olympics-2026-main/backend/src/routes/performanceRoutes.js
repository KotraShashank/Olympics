const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getAllProgress,
  getProgressBySport,
  getPerformanceSummary,
  getAllPerformance,
} = require('../controllers/performanceController');

router.use(protect);

router.get('/progress', getAllProgress);
router.get('/progress/:sportId', getProgressBySport);
router.get('/summary/:sportId', getPerformanceSummary);
router.get('/summary', getAllPerformance);

module.exports = router;
