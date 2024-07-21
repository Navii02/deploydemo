const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
const Alumni = require('../../models/Officer/Alumni');

// Route to fetch approved students
router.get('/officerstudent/approvedStudents', async (req, res) => {
    try {
      const approvedStudents = await ApprovedStudent.find();
      res.json(approvedStudents);
    } catch (error) {
      console.error('Error fetching approved students:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to update student details
router.put('/officerstudent/updateStudent/:studentId', async (req, res) => {
    const studentId = req.params.studentId;
    try {
      const updatedStudent = await ApprovedStudent.findByIdAndUpdate(studentId, req.body, { new: true });
      res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating student details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to fetch detailed student information
router.get('/officerstudent/approvedstudentDetails/:id', async (req, res) => {
    try {
      const studentId = req.params.id;
      const student = await ApprovedStudent.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      const { name, admissionType, admissionId, admissionNumber, allotmentCategory, feeCategory, address, permanentAddress, photo, pincode, religion, community, gender, dateOfBirth, bloodGroup, mobileNo, whatsappNo, email, entranceExam, entranceRollNo, entranceRank, aadharNo, course, annualIncome, nativity } = student;
      const { parentDetails } = student;
      const { bankDetails } = student;
      const { achievements } = student;
      const { qualify } = student;
      const photoUrl = photo ? `${req.protocol}://${req.get('host')}/ApprovedRemoved/image/${encodeURIComponent(photo)}` : null;
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
        }
      });
    } catch (error) {
      console.error('Error fetching student details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.get('/officerstudent/image/:path', async (req, res) => {
    const imagePath = req.params.path;
    //console.log(`Image path received: ${imagePath}`); // Log the received path
    const imageRef = ref(storage, imagePath);

    try {
        const url = await getDownloadURL(imageRef);
        res.redirect(url); // Redirect to the image URL
    } catch (error) {
        console.error('Error fetching image URL:', error);
        res.status(500).send('Error fetching image');
    }
});

router.get('/officerstudent/alumni', async (req, res) => {
  try {
    const alumni = await Alumni.find();
    res.json(alumni);
  } catch (error) {
    console.error('Error fetching alumni details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

  
  module.exports = router;