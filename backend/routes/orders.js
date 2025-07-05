// routes/orders.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../middleware/auth');

// POST /api/orders - Place an order
router.post('/', authenticateToken, orderController.placeOrder);

// GET /api/orders - Get orders for customer or farmer
router.get('/', authenticateToken, orderController.getOrders);

// PUT /api/orders/:id/payment - Update payment status
router.put('/:id/payment', authenticateToken, orderController.updatePaymentStatus);

module.exports = router;
