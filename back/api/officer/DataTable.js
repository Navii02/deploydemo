const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase'); // Ensure this path is correct

const Student = require('../../models/Officer/StudentAdmission');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
const NotAdmittedStudent = require('../../models/Officer/NotApprovedstudents');

const router = express.Router();

// Fetch all student admissions
router.get('/studentAdmission', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fetch student details by ID
router.get('/studentDetails/:id', async (req, res) => {
  try {
    const studentId = req.params.id;

    // Fetch student details including parentDetails from the database
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Extract necessary details for print preview
    const { name, admissionType, admissionId, admissionNumber, allotmentCategory, feeCategory, address, permanentAddress, photo, pincode, religion, community, gender, dateOfBirth, bloodGroup, mobileNo, whatsappNo, email, entranceExam, entranceRollNo, entranceRank, aadharNo, course, annualIncome, nativity,      submissionDate, } = student;
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
          cgpa: qualify.cgpa,
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
        
        submissionDate,
      },
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Decline student by ID and move to NotAdmittedStudents
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

// Fetch image URL
router.get('/image/:path', async (req, res) => {
  const imagePath = req.params.path;
  const imageRef = ref(storage, imagePath);

  try {
    const url = await getDownloadURL(imageRef);
    res.redirect(url); // Redirect to the image URL
  } catch (error) {
    console.error('Error fetching image URL:', error);
    res.status(500).send('Error fetching image');
  }
});

// Approve student and move to ApprovedStudents collection
router.post('/approve/:id', async (req, res) => {
  const studentId = req.params.id;
  const { admissionNumber: providedAdmissionNumber } = req.body; // Get admissionNumber from the request body

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    let semester;
    if (student.admissionType === 'KEAM' || student.admissionType === 'SPOT') {
      semester = 1;
    } else if (student.course === 'MCA' || student.course === 'BBA' || student.course === 'BCA') {
      semester = 1;
    } else if (student.admissionType === 'LET') {
      semester = 3;
    }

    let academicYear;
    const currentYear = new Date().getFullYear();
    if (['KEAM'].includes(student.admissionType) || ['BBA', 'BCA', 'B.Tech CSE', 'B.Tech ECE'].includes(student.course)) {
      const endYear = currentYear + 4;
      academicYear = `${currentYear}-${endYear}`;
    } else if (['LET'].includes(student.admissionType)) {
      const startYear = currentYear - 1;
      const endYear = startYear + 4;
      academicYear = `${startYear}-${endYear}`;
    } else if (['MCA'].includes(student.course)) {
      const endYear = currentYear + 1;
      academicYear = `${currentYear}-${endYear}`;
    }

    // Determine the next admission number based on the course
    let startingNumber;
    if (['B.Tech CSE', 'B.Tech ECE'].includes(student.course)) {
      startingNumber = 3333;
    } else if (['BCA'].includes(student.course)) {
      startingNumber = 20;
    } else if (['MCA'].includes(student.course)) {
      startingNumber = 30;
    } else if (['BBA'].includes(student.course)) {
      startingNumber = 400;
    } else {
      return res.status(400).json({ error: 'Invalid course' });
    }

    const lastStudent = await ApprovedStudent.findOne({ course: student.course }).sort({ field: 'asc', _id: -1 }).limit(1);
    let nextAdmissionNumber;
    if (lastStudent) {
      const lastAdmissionNumber = parseInt(lastStudent.admissionNumber.split('/')[0], 10);
      nextAdmissionNumber = `${lastAdmissionNumber + 1}/${currentYear.toString().substring(2)}`;
    } else {
      nextAdmissionNumber = `${startingNumber}/${currentYear.toString().substring(2)}`;
    }

    // Use the provided admission number if it differs from the generated one
    const admissionNumber = providedAdmissionNumber && providedAdmissionNumber !== nextAdmissionNumber
      ? providedAdmissionNumber
      : nextAdmissionNumber;

    const approvedStudentData = {
      ...student.toJSON(),
      semester,
      academicYear,
      admissionNumber
    };

    const approvedStudent = new ApprovedStudent(approvedStudentData);
    await approvedStudent.save();

    await Student.findByIdAndRemove(studentId);

    res.json({ message: 'Student approved and moved to the approved students collection' });
  } catch (error) {
    console.error('Error approving student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the last admission number for a specific course
router.post('/lastAdmissionNumbers', async (req, res) => {
  const { courses } = req.body;
  
  try {
    const numbers = await Promise.all(courses.map(async (course) => {
      const lastStudent = await ApprovedStudent.findOne({ course }).sort({ admissionNumber: -1 }).limit(1);
      const lastAdmissionNumber = lastStudent ? lastStudent.admissionNumber : '0';
      return { course, lastAdmissionNumber };
    }));

    res.json(numbers);
  } catch (error) {
    console.error('Error fetching last admission numbers:', error);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
