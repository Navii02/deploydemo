const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
  number: Number,
  status: {
    type: String,
    enum: ['Not Paid', 'Paid'],
    default: 'Not Paid',
  },
  paymentDate: Date,
  amount: Number,
});

const ApprovedStudentSchema = new mongoose.Schema({
  customId: String,
  admissionNumber: String,
  admissionType: String,
  admissionId: String,
  allotmentCategory: String,
  feeCategory: String,
  name: String,
  photo: String,
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
  collegemail: String, // New field for secondary email
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
  achievements: {
    arts: String,
    sports: String,
    other: String,
  },
  academicYear: String,
  semester: Number,
  installments: [InstallmentSchema], // Array of installment objects
});

// Pre-save middleware to generate custom ID before saving
ApprovedStudentSchema.pre('save', function(next) {
  const currentYear = new Date().getFullYear();
  this.customId = `${this.admissionNumber}/${currentYear}`;
  next();
});

const ApprovedStudent = mongoose.model('ApprovedStudent', ApprovedStudentSchema);

module.exports = ApprovedStudent;
