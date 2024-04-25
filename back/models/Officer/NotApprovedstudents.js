// models/notAdmittedStudent.js
const mongoose = require('mongoose');

const notAdmittedStudentSchema = new mongoose.Schema({
  // Include the same fields as the student admission schema
  admissionType: String,
  admissionId: String,
  allotmentCategory: String,
  feeCategory: String,
  name: String,
  photo: String, // Store file path for photo
  address: String,
  pincode: String,
  religion: String,
  community: String,
  gender: String,
  dateOfBirth: Date,
  bloodGroup: String,
  mobileNo: String,
  whatsappNo: String,
  email: String,
  entranceExam: String,
  entranceRollNo: String,
  entranceRank: String,
  aadharNo: String,
  course: String,
  plusTwo: {
    board: String,
    regNo: String,
    examMonthYear: String,
    percentage: String,
    schoolName: String,
    physics: String,
    chemistry: String,
    mathematics: String,
  },
  parentDetails: {
    fatherName: String,
    fatherOccupation: String,
    fatherMobileNo: String,
    motherName: String,
    motherOccupation: String,
    motherMobileNo: String,
  },
  annualIncome: String,
  nativity: String,
  bankDetails: {
    bankName: String,
    branch: String,
    accountNo: String,
    ifscCode: String,
  },
  achievements:{
    arts:String,
    sports: String,
    other: String,
  },
  academicYear: String
});

const NotAdmittedStudent = mongoose.model('NotAdmittedStudent', notAdmittedStudentSchema);

module.exports = NotAdmittedStudent;
