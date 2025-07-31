const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

// Get chat history
router.get('/', auth, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id })
      .sort({ timestamp: 1 });
    res.json({ success: true, chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching chat history' });
  }
});

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    const newChat = new Chat({
      user: req.user.id,
      message,
    });

    await newChat.save();
    res.json({ success: true, chat: newChat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending message' });
  }
});

module.exports = router;