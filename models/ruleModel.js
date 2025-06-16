const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A rule must have a name'],
    trim: true,
    maxlength: [40, 'A rule name must have less or equal then 40 characters'],
    minlength: [1, 'A rule name must have more than 1 character']
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
    maxlength: [500, 'A rule description must have less than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = { Rule };
