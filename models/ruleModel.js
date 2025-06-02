const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A rule must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'A rule name must have less or equal then 40 characters'],
    minlength: [1, 'A rule name must have more than 1 character']
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
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
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'A rule description must have less than 500 characters']
  }
});

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = { Rule };
