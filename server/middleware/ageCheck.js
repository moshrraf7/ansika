const ageCheck = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!req.user.isAdult) {
      return res.status(403).json({ 
        success: false, 
        message: 'Age verification required to access this content' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error checking age verification' 
    });
  }
};

module.exports = ageCheck;