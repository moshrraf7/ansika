const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');

// Admin dashboard route
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'Admin dashboard access granted',
      user: req.user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Error accessing admin dashboard' 
    });
  }
});

module.exports = router;