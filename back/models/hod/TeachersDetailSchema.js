// TeachersDetailSchema.js

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teachername: String,
  email: String,
  subjects: [String],
  subjectCode: [String],
  branches: [String],
  semesters: [String],
  academicYear: String,
  isHOD: {
    type: Boolean,
    default: false,
  },
  course: String,
  tutorassigned: {
    type: Boolean,
    default: false,
  },
});

const teacherDetails = mongoose.model('TeacherDetails', teacherSchema);

module.exports = teacherDetails;
