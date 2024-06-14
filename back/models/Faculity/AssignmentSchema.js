// models/Assignment.js

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: String,
  semester: String,
  subject: String,
  teachername: String,
  assignmentDetails: String,
  timestamp: { type: Date, default: Date.now },
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
