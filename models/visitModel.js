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
  policyId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Policy',
    required: true
  }
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = { Visit };
