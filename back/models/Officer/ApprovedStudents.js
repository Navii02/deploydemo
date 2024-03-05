// models/student.js
const mongoose = require('mongoose');

const approvedStudentSchema = new mongoose.Schema({
  // Include the same fields as the student admission schema
  admissionType: String,
  admissionId: String,
  allotmentCategory: String,
  feeCategory: String,
  name: String,
  photoPath: String,
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
  entranceExam: {
    type: String,
    name: String,
    other: String,
  },
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
    father: {
      fathername: String,
      occupation: String,
      mobileNo: String,
    },
    mother: {
      mothername: String,
      occupation: String,
      mobileNo: String,
    },
  },
  annualIncome: String,
  nativity: String,
  bankDetails: {
    bankName: String,
    branch: String,
    accountNo: String,
    ifscCode: String,
  },
});

const ApprovedStudent = mongoose.model('ApprovedStudent', approvedStudentSchema);

module.exports = ApprovedStudent;
