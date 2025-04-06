const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#1976d2',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    editorSettings: {
      fontSize: { type: Number, default: 14 },
      fontFamily: { type: String, default: 'Arial' },
      lineHeight: { type: Number, default: 1.5 },
      autoSave: { type: Boolean, default: true }
    }
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
