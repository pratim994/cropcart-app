// controllers/orderController.js
const { pool } = require('../config/db');

exports.placeOrder = async (req, res) => {
  try {
    if (req.user.user_type !== 'customer') {
      return res.status(403).json({ error: 'Only customers can place orders' });
    }

    const { crop_id, quantity, payment_method } = req.body;
    const conn = await pool.getConnection();

    const [crops] = await conn.execute('SELECT * FROM crops WHERE id = ?', [crop_id]);
    if (crops.length === 0) {
      conn.release();
      return res.status(404).json({ error: 'Crop not found' });
    }

    const crop = crops[0];
    if (crop.quantity_available < quantity) {
      conn.release();
      return res.status(400).json({ error: 'Insufficient quantity available' });
    }

    const total_amount = crop.price * quantity;

    const [orderResult] = await conn.execute(
      'INSERT INTO orders (customer_id, crop_id, farmer_id, quantity, total_amount, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, crop_id, crop.farmer_id, quantity, total_amount, payment_method]
    );

    await conn.execute(
      'UPDATE crops SET quantity_available = quantity_available - ?, quantity_sold = quantity_sold + ? WHERE id = ?',
      [quantity, quantity, crop_id]
    );

    conn.release();

    res.status(201).json({ order_id: orderResult.insertId, total_amount, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    let query, params;

    if (req.user.user_type === 'customer') {
      query = `
        SELECT o.*, c.name as crop_name, c.image_url, u.name as farmer_name
        FROM orders o
        JOIN crops c ON o.crop_id = c.id
        JOIN users u ON o.farmer_id = u.id
        WHERE o.customer_id = ?
        ORDER BY o.created_at DESC
      `;
      params = [req.user.id];
    } else {
      query = `
        SELECT o.*, c.name as crop_name, c.image_url, u.name as customer_name
        FROM orders o
        JOIN crops c ON o.crop_id = c.id
        JOIN users u ON o.customer_id = u.id
        WHERE o.farmer_id = ?
        ORDER BY o.created_at DESC
      `;
      params = [req.user.id];
    }

    const [orders] = await conn.execute(query, params);
    conn.release();

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment_status } = req.body;
    const conn = await pool.getConnection();

    await conn.execute(
      'UPDATE orders SET payment_status = ? WHERE id = ? AND customer_id = ?',
      [payment_status, req.params.id, req.user.id]
    );

    conn.release();
    res.json({ message: 'Payment status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
};
