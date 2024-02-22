const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
 
  email: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type:Date
  },
  age: {
    type: Number,
  },
  branch: {
    type: String,
  },
  semester: {
    type: String,
  },
  address: {
    type: String,
  },
  gender: {
    type: String,
  },
  religion: {
    type: String,
  },
 caste: {
    type: String,
  },
  category: {
    type: String,
  },
  plusTwoPercentage: {
    type: Number,
  },
  tenthPercentage: {
    type: Number,
  },
  firstYearFees: {
    type: String,
  },
  secondYearFees: {
    type: String,
  },
  thirdYearFees: {
    type: String,
  },
  fourthYearFees: {
    type: String,
  },

  date: {
    type: Date,
    default: Date.now,
  },
})

const student = mongoose.model('StudentData', StudentSchema)

module.exports = student
