const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const auth = require('../middleware/auth');
const ageCheck = require('../middleware/ageCheck');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get media by category
router.get('/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    
    if (category === 'video') {
      // Additional check for video category
      const user = await User.findById(req.user.id);
      if (!user.isAdult) {
        return res.status(403).json({ 
          success: false, 
          message: 'Age verification required to access video content' 
        });
      }
    }

    const media = await Media.find({ category });
    res.json({ success: true, media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching media' });
  }
});

// Admin upload media
router.post('/', auth, ageCheck, upload.single('media'), async (req, res) => {
  try {
    const { title, category, isVideo } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const newMedia = new Media({
      title,
      url: `/uploads/${file.filename}`,
      category,
      isVideo,
    });

    await newMedia.save();
    res.json({ success: true, media: newMedia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error uploading media' });
  }
});

module.exports = router;