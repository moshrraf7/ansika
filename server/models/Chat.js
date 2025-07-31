const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  response: String,
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model('Chat', ChatSchema);