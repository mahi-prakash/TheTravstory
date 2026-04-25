const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts.controller');

// GET /api/posts - Fetch explore feed
router.get('/', postsController.getPosts);

// POST /api/posts/interactions - Record ML interactions (like, skip, save)
router.post('/interactions', postsController.recordInteraction);

module.exports = router;
