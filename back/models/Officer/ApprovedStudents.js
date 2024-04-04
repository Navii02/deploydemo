// models/ApprovedStudent.js
const mongoose = require('mongoose');

const approvedStudentConnection = mongoose.createConnection('mongodb+srv://naveenshaji02:naveen@collegeofficedata.scsxkdd.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle connection errors
approvedStudentConnection.on('error', (error) => {
  console.error('Approved Student Database Connection Error:', error);
});

// Listen for the connected event
approvedStudentConnection.on('open', () => {
  console.log('Connected to Approved Student Database');
});

const ApprovedStudentSchema = new mongoose.Schema({
  admissionNumber: String, // Include the admission number field
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
  semester: Number, // Include the semester field
});

const ApprovedStudent = approvedStudentConnection.model('ApprovedStudent', ApprovedStudentSchema);

module.exports = ApprovedStudent;
