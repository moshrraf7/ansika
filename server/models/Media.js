const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  thumbnail: String,
  category: { 
    type: String, 
    required: true,
    enum: ['beauty', 'beach', 'hot', 'cutie', 'video'] 
  },
  isVideo: { type: Boolean, default: false },
  uploadDate: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
});

module.exports = mongoose.model('Media', MediaSchema);