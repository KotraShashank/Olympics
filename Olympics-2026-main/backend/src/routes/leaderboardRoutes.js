const router = require('express').Router();
const { getLeaderboard } = require('../controllers/leaderboardController');

// Public - anyone can view the leaderboard, same permission level as GET /api/sports
router.get('/', getLeaderboard);

module.exports = router;