const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
    maxlength: [40, 'A user name must have less or equal then 40 characters'],
    minlength: [1, 'A user name must have more than 1 character']
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(val) {
        // return validator.isEmail(val);
        return /\S+@\S+\.\S+/.test(val); // Simple regex for email validation
      },
      message: 'Please provide a valid email!'
    }
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'A password must have more than or equal to 8 characters']
  },
  slug: String,
  rules: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Rule',
      required: true
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
