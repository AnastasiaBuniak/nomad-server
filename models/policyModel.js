const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A policy must have a name'],
    trim: true,
    maxlength: [40, 'A policy name must have less or equal then 40 characters'],
    minlength: [1, 'A policy name must have more than 1 character']
  },
  visits: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Visit',
      required: true
    }
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'A policy description must have less than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  ruleWindow: {
    type: Number,
    required: [true, 'A policy must have a window'],
    default: 90
  },
  allowedRuleWindow: {
    type: Number,
    required: [true, 'A policy must have an allowed window'],
    default: 180
  }
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = { Policy };
