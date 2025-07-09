// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { initializeDatabase } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('PORT:', process.env.PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Test one route at a time
app.use('/api/auth', require('./routes/auth'));
 //app.use('/api/crop', require('./routes/crops'));
// app.use('/api/orders', require('./routes/orders'));
// app.use('/api/reviews', require('./routes/reviews'));
// app.use('/api/chat', require('./routes/chat'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/skeleton.html'));
});

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
  await initializeDatabase();
});