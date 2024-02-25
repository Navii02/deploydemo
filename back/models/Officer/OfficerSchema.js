const mongoose = require('mongoose')

const OfficerSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
})

const Officer = mongoose.model('Officer', OfficerSchema)

module.exports = Officer
