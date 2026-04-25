const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, saveOnlyMessage } = require('../controllers/messages.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, sendMessage);
router.post('/save-only', authMiddleware, saveOnlyMessage);
router.get('/:trip_id', authMiddleware, getMessages);

module.exports = router;