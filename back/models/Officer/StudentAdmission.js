// models/student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  admissionType: String,
  admissionId: String,
  allotmentCategory: String,
  feeCategory: String,
  name: String,
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
    cgpa: String,
  },
  parentDetails: {
    fatherName: {
      type: String,
      default: "Nil",
    },
    fatherOccupation: {
      type: String,
      default: "Nil",
    },
    fatherMobileNo: {
      type: String,
      default: "Nil",
    },
    motherName: {
      type: String,
      default: "Nil",
    },
    motherOccupation: {
      type: String,
      default: "Nil",
    },
    motherMobileNo: {
      type: String,
      default: "Nil",
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
  achievements: {
    arts: {
      type: String,
      default: "Nil",
    },
    sports: {
      type: String,
      default: "Nil",
    },
    other: {
      type: String,
      default: "Nil",
    },
  },
  marks: {
    boardType: String,
    physics: String,
    chemistry: String,
    maths: String,
  },
  certificates: {
    tenth: { type: Boolean, default: false },
    plusTwo: { type: Boolean, default: false },
    tcandconduct: { type: Boolean, default: false },
    allotmentmemo: { type: Boolean, default: false },
    Datasheet: { type: Boolean, default: false },
    physicalfitness: { type: Boolean, default: false },
    passportsizephoto: { type: Boolean, default: false },
    incomecertificates: { type: Boolean, default: false },
    communitycertificate: { type: Boolean, default: false },
    castecertificates: { type: Boolean, default: false },
    aadhaar: { type: Boolean, default: false },
    other: { type: Boolean, default: false },
  },
  submissionDate: {
    type: Date,
    // Set the default value to the current date and time
  },
});

const StudentAdmission = mongoose.model("StudentAdmission", studentSchema);

module.exports = StudentAdmission;
