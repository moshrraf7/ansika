const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: error.message || 'Not authorized to access this resource' 
    });
  }
};

const adminAuth = async (req, res, next) => {
  auth(req, res, () => {
    if (req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }
    next();
  });
};

module.exports = { auth, adminAuth };