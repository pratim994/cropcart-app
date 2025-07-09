// routes/crops.js
const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET /api/crops
router.get('/', cropController.getAllCrops);

// GET /api/crops/:id
router.get('/:id', cropController.getCropById);

// POST /api/crops
router.post('/', authenticateToken, upload.single('image'), cropController.addCrops);
// PUT /api/crops/:id
router.put('/:id', authenticateToken, cropController.updateCrop);
// GET /api/farmer/crops
router.get('/farmer/mine', (req, res) => {
  res.send('Farmer crop route working ✅');
});

module.exports = router;
