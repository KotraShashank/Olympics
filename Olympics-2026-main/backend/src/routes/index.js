const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/sports', require('./sportRoutes'));
router.use('/matches', require('./matchRoutes'));
router.use('/performance', require('./performanceRoutes'));
router.use('/leaderboard', require('./leaderboardRoutes'));

module.exports = router;
