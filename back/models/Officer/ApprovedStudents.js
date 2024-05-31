const mongoose = require('mongoose');

const ApprovedStudentSchema = new mongoose.Schema({
  customId: String,
  admissionNumber: String,
  admissionType: String,
  admissionId: String,
  allotmentCategory: String,
  feeCategory: String,
  name: String,
  otherCertificate:String,
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
  email: String,
  entranceExam: String,
  entranceRollNo: String,
  entranceRank: String,
  aadharNo: String,
  course: String,
  qualify: {
    exam: String,
    board: String,
    regNo: String,
    examMonthYear: String,
    percentage: String,
    institution: String,
    cgpa:String,
    
  },
  parentDetails: {
    fatherName:{
      type: String,
      default: 'Nil',
    },
    fatherOccupation:{
      type: String,
      default: 'Nil',
    },
    fatherMobileNo:{
      type: String,
      default: 'Nil',
    },
    motherName:{
      type: String,
      default: 'Nil',
    },
    motherOccupation:{
      type: String,
      default: 'Nil',
    },
    motherMobileNo: {
      type: String,
      default: 'Nil',
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
  achievements:{
    arts:{
      type: String,
      default: 'Nil',
    },
    sports:{
      type: String,
      default: 'Nil',
    },
    other:{
      type: String,
      default: 'Nil',
    },
  },
  academicYear: String,
  semester: String,
 
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
    type: [String], // Array of strings (email addresses)
    default: [],    // Default value is an empty array
   
  }
  
});
 

// Pre-save middleware to generate custom ID before saving
ApprovedStudentSchema.pre('save', function(next) {
  const currentYear = new Date().getFullYear();
  this.customId = `${this.admissionNumber}/${currentYear}`;
  next();
});

const ApprovedStudent = mongoose.model('ApprovedStudent', ApprovedStudentSchema);

module.exports = ApprovedStudent;
