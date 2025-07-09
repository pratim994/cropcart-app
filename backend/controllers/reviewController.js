// controllers/reviewController.js
const { pool } = require('../config/db');

exports.addReview = async (req, res) => {
  try {
    if (req.user.user_type !== 'customer') {
      return res.status(403).json({ error: 'Only customers can leave reviews' });
    }

    const { farmer_id, crop_id, order_id, rating, review_text } = req.body;

    const conn = await pool.getConnection();
    await conn.execute(
      'INSERT INTO reviews (customer_id, farmer_id, crop_id, order_id, rating, review_text) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, farmer_id, crop_id, order_id, rating, review_text]
    );
    conn.release();

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};

exports.getFarmerReviews = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [reviews] = await conn.execute(`
      SELECT r.*, u.name as customer_name, c.name as crop_name
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      JOIN crops c ON r.crop_id = c.id
      WHERE r.farmer_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.id]);
    conn.release();

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
