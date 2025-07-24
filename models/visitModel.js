const { rules } = require('eslint-config-prettier');
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  entry: {
    type: Date,
    default: Date.now
  },
  exit: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    required: [true, 'A user must have a duration']
  },
  rule: {
    type: mongoose.Schema.ObjectId,
    ref: 'Rule',
    required: true
  }
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = { Visit };
