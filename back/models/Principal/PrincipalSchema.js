const mongoose = require('mongoose')

const PrincipalSchema = new mongoose.Schema({
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

const principal = mongoose.model('principal', PrincipalSchema)

module.exports = principal
