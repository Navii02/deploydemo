const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
  customId: String,
  admissionNumber: { type: String },
  name: { type: String},
  admissionType: String,
  admissionId: String,
  allotmentCategory: String,
  feeCategory: String,
  otherCertificate: String,
  photo: String, // Store file path for photo
  address: String,
  permanentAddress: String,
  pincode: String,
  religion: String,
  community: String,
  gender: String,
  dateOfBirth: Date,
  bloodGroup: String,
  mobileNo: String,
  whatsappNo: String,
  entranceExam: String,
  entranceRollNo: String,
  entranceRank: String,
  aadharNo: String,
  course: { type: String },
  qualify: {
    exam: String,
    board: String,
    regNo: String,
    examMonthYear: String,
    percentage: String,
    institution: String,
    cgpa: String,
  },
  parentDetails: {
    fatherName: { type: String, default: 'Nil' },
    fatherOccupation: { type: String, default: 'Nil' },
    fatherMobileNo: { type: String, default: 'Nil' },
    motherName: { type: String, default: 'Nil' },
    motherOccupation: { type: String, default: 'Nil' },
    motherMobileNo: { type: String, default: 'Nil' },
  },
  annualIncome: String,
  nativity: String,
  bankDetails: {
    bankName: String,
    branch: String,
    accountNo: String,
    ifscCode: String,
  },
  achievements: {
    arts: { type: String, default: 'Nil' },
    sports: { type: String, default: 'Nil' },
    other: { type: String, default: 'Nil' },
  },
  academicYear: String,
  semester: { type: String, required: true },
  assignments: { type: String, default: 'Not Assigned' },
  exams: { type: String, default: 'Not Scheduled' },
  
  installmentsPaid: [Number],
 
 RegisterNo: { type: String },
  email: { type: String, required: true },
  collegemail: String, // Array of strings (email addresses)
  tutormessage: [String], // Array of strings
  internalMarks: [
    {
      
      subject: String,
      examMarks: Number,
      assignmentMarks: Number,
      attendance: Number,
      totalMarks: String
    }
  ],
  attendance: [
    {
    date: { type: String, required: true },
    subject: { type: String, required: true },
    hour: { type: String, required: true },
    teachername: { type: String, required: true },
    status: { type: String, required: true }
    }
  ],
  subjectPercentages: [{
    subject: { type: String, required: true },
    percentage: { type: Number, required: true }
  }],
  submissionDate: {
    type: Date,
   // Set the default value to the current date and time
  },
});


const Alumni = mongoose.model('Alumni', AlumniSchema);

module.exports = Alumni;
