-- schema.sql
USE agromarket;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type ENUM('farmer', 'customer') NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crops (
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

CREATE TABLE chats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  farmer_id INT,
  message TEXT NOT NULL,
  sender_type ENUM('farmer', 'customer') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (farmer_id) REFERENCES users(id)
);

CREATE TABLE orders (
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

CREATE TABLE reviews (
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