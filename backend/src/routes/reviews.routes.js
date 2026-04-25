const express = require('express');
const router = express.Router();
const { submitReview, getTripReviews } = require('../controllers/reviews.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, submitReview);
router.get('/trip/:trip_id', authMiddleware, getTripReviews);

module.exports = router;
