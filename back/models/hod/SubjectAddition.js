const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    semester: Number,
    subjects: [{ subjectName: String, subjectCode: String }],
    minorSubject: String,
    minorSubjectCode: String,
  });

module.exports = mongoose.model('Subject', subjectSchema);
