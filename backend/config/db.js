// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  const conn = await pool.getConnection();
  try {
    await conn.query('CREATE DATABASE IF NOT EXISTS agromarket');
    await conn.query('USE agromarket');

    // Create tables in dependency order
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        user_type ENUM('farmer', 'customer') NOT NULL,
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS crops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        farmer_id INT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        quantity_available INT NOT NULL,
        quantity_sold INT DEFAULT 0,
        grade VARCHAR(10),
        harvest_date DATE,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES users(id)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        farmer_id INT,
        message TEXT NOT NULL,
        sender_type ENUM('farmer', 'customer') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users(id),
        FOREIGN KEY (farmer_id) REFERENCES users(id)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        crop_id INT,
        farmer_id INT,
        quantity INT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        payment_status ENUM('pending', 'completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users(id),
        FOREIGN KEY (crop_id) REFERENCES crops(id),
        FOREIGN KEY (farmer_id) REFERENCES users(id)
      );
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT,
        farmer_id INT,
        crop_id INT,
        order_id INT,
        rating INT NOT NULL,
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES users(id),
        FOREIGN KEY (farmer_id) REFERENCES users(id),
        FOREIGN KEY (crop_id) REFERENCES crops(id),
        FOREIGN KEY (order_id) REFERENCES orders(id)
      );
    `);

    console.log('Database and tables initialized');
  } catch (err) {
    console.error('Database initialization failed:', err.message);
  } finally {
    conn.release();
  }
}

// Optional: Test connection on direct execution
if (require.main === module) {
  (async () => {
    try {
      const conn = await pool.getConnection();
      console.log('✅ MySQL connection successful!');
      const [rows] = await conn.query('SHOW TABLES');
      console.log('📋 Tables:', rows);
      conn.release();
    } catch (err) {
      console.error('❌ MySQL connection failed:', err.message);
    }
  })();
}

module.exports = { pool, initializeDatabase };