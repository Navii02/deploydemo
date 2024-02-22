// TeachersDetailSchema.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teachername: String, // Ensure that the field name is 'teachername'
  email: String,
  subjects: [String],
  branches: [String],
  semesters: [String],
});

const teacherDetails = mongoose.model('TeacherDetails', teacherSchema);

module.exports = teacherDetails;
