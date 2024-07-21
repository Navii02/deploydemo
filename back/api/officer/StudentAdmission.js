const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase'); // Import Firebase Storage methods

const Student = require('../../models/Officer/StudentAdmission');

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });

router.post('/studentadmission', upload.single('photo'), async (req, res) => {
  try {
    let photoUrl = '';
    if (req.file) {
      const storageRef = ref(storage, `student_photos/${Date.now()}_${req.body.name.replace(/\s+/g, '_')}_${req.file.originalname}`);
      const snapshot = await uploadBytes(storageRef, req.file.buffer);
      photoUrl = await getDownloadURL(snapshot.ref);
    }
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
   

    const newStudent = new Student({
      ...req.body,
      admissionId: nextAdmissionId,
      photo: photoUrl,
      qualify: {
        exam: req.body['qualify.exam'],
        board: req.body['qualify.board'],
        regNo: req.body['qualify.regNo'],
        examMonthYear: req.body['qualify.examMonthYear'],
        percentage: req.body['qualify.percentage'],
        cgpa: req.body['qualify.cgpa'],
        institution: req.body['qualify.institution'],
      },
      parentDetails: {
        fatherName: req.body['parentDetails.fatherName'],
        fatherOccupation: req.body['parentDetails.fatherOccupation'],
        fatherMobileNo: req.body['parentDetails.fatherMobileNo'],
        motherName: req.body['parentDetails.motherName'],
        motherOccupation: req.body['parentDetails.motherOccupation'],
        motherMobileNo: req.body['parentDetails.motherMobileNo'],
      },
      bankDetails: {
        bankName: req.body['bankDetails.bankName'],
        branch: req.body['bankDetails.branch'],
        accountNo: req.body['bankDetails.accountNo'],
        ifscCode: req.body['bankDetails.ifscCode'],
      },
      achievements: {
        arts: req.body['achievements.arts'],
        sports: req.body['achievements.sports'],
        other: req.body['achievements.other'],
      },
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student data saved successfully', data: newStudent });
  } catch (error) {
    console.error('Error saving student data:', error);
    res.status(500).json({ message: 'Error saving student data', error });
  }
});


module.exports = router;
