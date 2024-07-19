const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

const Student = require('../../models/Officer/StudentAdmission');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
const NotAdmittedStudent = require('../../models/Officer/NotApprovedstudents');

const router = express.Router();

// Multer storage configuration for handling file uploads
const sanitizeFilename = (name) => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../studentsphoto/');
  },
  filename: function (req, file, cb) {
    const fileId = new mongoose.Types.ObjectId();
    const studentName = sanitizeFilename(req.body.name || 'unknown'); // Fallback to 'unknown' if name is not provided
    const filename = `${studentName}_${fileId}${path.extname(file.originalname)}`;
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

    

    const lastStudent = await Student.findOne().sort({ field: 'asc', _id: -1 }).limit(1);

    let nextAdmissionId;
    if (lastStudent) {
      // Extract the last admission ID and increment it by one
      const lastAdmissionId = lastStudent.admissionId.split('/')[0];
      const nextAdmissionNumber = parseInt(lastAdmissionId) + 1;
      nextAdmissionId = `${nextAdmissionNumber}/${admissionYear}`;
    } else {
      // If no previous admission, start from a default number
      nextAdmissionId = '1000/' +admissionYear;
    }
    formData.admissionId = nextAdmissionId;
   

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
    const { name, admissionType, admissionId,admissionNumber, allotmentCategory, feeCategory, address,permanentAddress, photo, pincode, religion, community, gender, dateOfBirth, bloodGroup, mobileNo, whatsappNo, email, entranceExam, entranceRollNo, entranceRank, aadharNo, course, annualIncome, nativity } = student;
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
        admissionNumber,
        allotmentCategory,
        feeCategory,
        address,
        permanentAddress,
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
          exam: qualify.exam,
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
    if (student.admissionType === 'KEAM' || student.admissionType === 'SPOT') {
      // For KEAM or Spot admission, set semester as 1
      semester = 1;
    } else if (student.course === 'MCA' || student.course === 'BBA' || student.course === 'BCA') {
      semester = 1;
    } else if (student.admissionType === 'LET') {
      // For LET admission, set semester as 3
      semester = 3;
    }

    // Determine the academic year for certain admission types and courses
    let academicYear;
    
    if (['KEAM',].includes(student.admissionType) || [ 'BBA', 'BCA','B.Tech CSE','B.Tech ECE'].includes(student.course)) {
      const currentYear = new Date().getFullYear();
      const endYear = currentYear + 4;
      academicYear = `${currentYear}-${endYear}`;
    }else if(['LET'].includes(student.admissionType)) {
      const currentYear = new Date().getFullYear();
      const startyear = currentYear-1;
      const endYear = startyear + 4;
      academicYear = `${startyear}-${endYear}`;
    }else if(['MCA'].includes(student.course)) {
      const currentYear = new Date().getFullYear();
      const endYear = currentYear + 1;
      academicYear = `${currentYear}-${endYear}`;
    }

    // Perform the approval process
    const approvedStudentData = {
      ...student.toJSON(),
      semester: semester,
      academicYear: academicYear
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