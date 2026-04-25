const express = require('express');
const router = express.Router();
const { register, login, getMe, saveQuiz, googleLogin } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/quiz', authMiddleware, saveQuiz);
router.post('/google-login', googleLogin);

module.exports = router;