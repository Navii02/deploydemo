const mongoose = require('mongoose');

const AlumniStudentSchema = new mongoose.Schema({
  customId: String,
  admissionNumber: String,
  name: String,
  admissionType: String,
  address: String,
  pincode: String,
  religion: String,
  community: String,
  gender: String,
  dateOfBirth: Date,
  bloodGroup: String,
  mobileNo: String,
  email: String,
  whatsappNo: String,
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
  tutormessage: {
    type: [String],
  },
  achievements: {
    arts: String,
    sports: String,
    other: String,
  },
  academicYear: String,
  semester: Number,
  assignments: {
    type: String,
    default: 'Not Assigned',
  },
  exams: {
    type: String,
    default: 'Not Scheduled',
  },
  attendance: {
    type: String,
    default: 'N/A',
  },
  installmentsPaid: [Number],
  registerNumber: String,
  collegemail: {
    type: [String],
    default: [],
  }
});

const AlumniStudent = mongoose.model('AlumniStudent', AlumniStudentSchema);

module.exports = AlumniStudent;
