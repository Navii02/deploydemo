// HODDetailSchema.js
const mongoose = require('mongoose');

const hodDetailSchema = new mongoose.Schema({
  teacherid:String,
  teachername: String,
  email: String,
  subjects: [String],
  subjectCode: [String],
  branches: [String],
  semesters: [String],
  academicYear: String,
  course: String,
 
});

const HODDetail = mongoose.model('hoddetails', hodDetailSchema);

module.exports = HODDetail;
