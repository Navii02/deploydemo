const mongoose = require('mongoose')

const FaculitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationCode: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const faculity = mongoose.model('faculity', FaculitySchema)

module.exports = faculity
