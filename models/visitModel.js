const { rules } = require('eslint-config-prettier');
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    required: [true, 'A user must have a duration']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  rules: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Rule',
      required: true
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = { Visit };
