const router = require('express').Router();
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');

// Mirrors: SecurityConfig -> .requestMatchers("/api/auth/**").permitAll()
router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Protected routes - require authentication
router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
