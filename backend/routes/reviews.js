// routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authenticateToken = require('../middleware/auth');

// POST /api/reviews - Add a review
router.post('/', authenticateToken, reviewController.addReview);

// GET /api/farmers/:id/reviews - Get reviews for a specific farmer
router.get('/farmers/:id/reviews', reviewController.getFarmerReviews);

module.exports = router;