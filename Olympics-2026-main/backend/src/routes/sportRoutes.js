const router = require('express').Router();
const { getAllSports, getOlympicSports, getSportById } = require('../controllers/sportController');

// Mirrors: SecurityConfig -> .requestMatchers(HttpMethod.GET, "/api/sports/**").permitAll()
router.get('/', getAllSports);
router.get('/olympic', getOlympicSports);
router.get('/:id', getSportById);

module.exports = router;
