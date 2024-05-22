const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const Student = require('../../models/Officer/StudentAdmission');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
const NotAdmittedStudent = require('../../models/Officer/NotApprovedstudents');

const router = express.Router();

// Multer storage configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'studentsphoto/'); 
  },
  filename: function (req, file, cb) {
    const fileId = new mongoose.Types.ObjectId(); 
    const filename = `${fileId}${path.extname(file.originalname)}`; 
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Express middleware to handle file upload
router.post('/studentAdmission', upload.single('photo'), async (req, res) => {
  try {
    const formData = req.body;
    formData.photo = req.file ? req.file.path : null;

    const admissionYear = new Date().getFullYear(); // Get the current year

    // Calculate the end year of the academic year based on admission type
    let academicYearEnd;
    if (formData.admissionType === 'LET') {
      // For LET (Lateral Entry), academic year spans from (current year) to (current year + 3)
      academicYearEnd = admissionYear + 3;
    } else {
      // For other admission types, academic year end is current year + 4 (default logic)
      academicYearEnd = admissionYear + 4;
    }

    // Calculate the start year of the academic year (current year - 1 for LET)
    const academicYearStart = formData.admissionType === 'LET' ? admissionYear - 1 : admissionYear;

    // Construct the academic year string
    const academicYear = `${academicYearStart}-${academicYearEnd}`;

    const lastStudent = await Student.findOne().sort({ field: 'asc', _id: -1 }).limit(1);

    let nextAdmissionId;
    if (lastStudent) {
      // Extract the last admission ID and increment it by one
      const lastAdmissionId = lastStudent.admissionId.split('/')[0];
      const nextAdmissionNumber = parseInt(lastAdmissionId) + 1;
      nextAdmissionId = `${nextAdmissionNumber}/${academicYear}`;
    } else {
      // If no previous admission, start from a default number
      nextAdmissionId = '1000/' +admissionYear;
    }
    formData.admissionId = nextAdmissionId;
    formData.academicYear = academicYear;

    if (formData.plusTwo && formData.plusTwo.registerNo) {
      const existingStudent = await Student.findOne({ 'plusTwo.regNo': formData.plusTwo.regNo });

      if (existingStudent) {
        return res.status(400).json({ error: 'Duplicate registerNumber' });
      }
    }

    const newStudent = new Student(formData);
    await newStudent.save();

    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/studentAdmission', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/studentDetails/:id', async (req, res) => {
  try {
    const studentId = req.params.id;

    // Fetch student details including parentDetails from the database
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Extract necessary details for print preview
    const { name, admissionType, admissionId, allotmentCategory, feeCategory, address, photo, pincode, religion, community, gender, dateOfBirth, bloodGroup, mobileNo, whatsappNo, email, entranceExam, entranceRollNo, entranceRank, aadharNo, course, annualIncome, nativity } = student;
    const { parentDetails } = student;
    const { bankDetails } = student;
    const { achievements } = student;
    const { qualify } = student;
    const photoUrl = photo ? `${req.protocol}://${req.get('host')}/${photo}` : null;

    res.json({
      studentDetails: {
        name,
        admissionType,
        admissionId,
        allotmentCategory,
        feeCategory,
        address,
        pincode,
        religion,
        community,
        gender,
        dateOfBirth,
        bloodGroup,
        mobileNo,
        whatsappNo,
        email,
        entranceExam,
        entranceRollNo,
        entranceRank,
        aadharNo,
        course,
        annualIncome,
        nativity,
        photoUrl,
        qualify: {
          board: qualify.board,
          regNo: qualify.regNo,
          examMonthYear: qualify.examMonthYear,
          percentage: qualify.percentage,
          institution: qualify.institution,
          cgpa:qualify.cgpa,

        },
        parentDetails: {
          fatherName: parentDetails.fatherName,
          fatherOccupation: parentDetails.fatherOccupation,
          fatherMobileNo: parentDetails.fatherMobileNo,
          motherName: parentDetails.motherName,
          motherOccupation: parentDetails.motherOccupation,
          motherMobileNo: parentDetails.motherMobileNo,
        },
        bankDetails: {
          bankName: bankDetails.bankName,
          branch: bankDetails.branch,
          accountNo: bankDetails.accountNo,
          ifscCode: bankDetails.ifscCode,
        },
        achievements: {
          arts: achievements.arts,
          sports: achievements.sports,
          other: achievements.other,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/decline/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const notAdmittedStudent = new NotAdmittedStudent(student.toJSON());
    await notAdmittedStudent.save();

    await Student.findByIdAndRemove(studentId);

    res.json({ message: 'Student Declined and Moved to Not Admitted Students Collection' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/approve/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    // Check if the student exists
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Determine the semester based on admission type
    let semester;
    if (student.admissionType === 'KEAM' || student.admissionType === 'Spot') {
      // For KEAM or Spot admission, set semester as 1
      semester = 1;
    } else if (student.admissionType === 'LET') {
      // For LET admission, set semester as 3
      semester = 3;
    }

    // Perform the approval process
    const approvedStudentData = {
      ...student.toJSON(),
      semester: semester,
    };

    // Generate the new admission ID with the current year
    const currentYear = new Date().getFullYear().toString().substring(2); // Extract last two digits of the current year
    const lastStudent = await ApprovedStudent.findOne().sort({ field: 'asc', _id: -1 }).limit(1);
    let nextAdmissionNumber;
    if (lastStudent) {
      // Check if admissionNumber exists before splitting
      if (lastStudent.admissionNumber) {
        const lastAdmissionNumber = parseInt(lastStudent.admissionNumber.split('/')[0], 10);
        nextAdmissionNumber = `${lastAdmissionNumber + 1}/${currentYear}`;
      } else {
        nextAdmissionNumber = `100/${currentYear}`;
      }
    } else {
      nextAdmissionNumber = `100/${currentYear}`;
    }
    approvedStudentData.admissionNumber = nextAdmissionNumber;

    const approvedStudent = new ApprovedStudent(approvedStudentData);
    await approvedStudent.save();

    // Remove the student from the student admission collection
    await Student.findByIdAndRemove(studentId);

    // Respond with success message
    res.json({ message: 'Student approved and moved to the approved students collection' });
  } catch (error) {
    // Handle errors
    console.error('Error approving student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
