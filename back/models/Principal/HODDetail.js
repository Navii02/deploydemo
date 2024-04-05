// HODDetailSchema.js
const mongoose = require('mongoose');

const hodDetailSchema = new mongoose.Schema({
  customId: {
    type: String,
    required: true
  },
  teachername: {
    type: String,
    required: true
  },
  email: String,
  subjects: [String],
  branches: [String],
  semesters: [String],
  position: {
    type: String,
    default: 'HOD'
  }
});

const HODDetail = mongoose.model('HODDetail', hodDetailSchema);

module.exports = HODDetail;
