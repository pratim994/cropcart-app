// routes/chats.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middleware/auth');

// POST /api/chats - Send a message
router.post('/', authenticateToken, chatController.sendMessage);

// GET /api/chats/:farmer_id/:customer_id - Fetch chat messages
router.get('/:farmer_id/:customer_id', authenticateToken, chatController.getMessages);
module.exports = router;
