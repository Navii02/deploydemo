const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase'); // Ensure this path is correct

const Student = require('../../models/Officer/StudentAdmission');

const router = express.Router();

// Function to sanitize filenames
const sanitizeFilename = (name) => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

// Multer memory storage to handle file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add/studentAdmission', upload.single('photo'), async (req, res) => {
  try {
    const formData = req.body;
    console.log('Request body:', req.body);
    console.log('File data:', req.file);

    if (req.file) {
      // Generate a unique filename
      const fileId = uuidv4();
      const studentName = sanitizeFilename(req.body.name || 'unknown');
      const filename = `${studentName}_${fileId}${path.extname(req.file.originalname)}`;
      
      // Specify the folder where you want to save the file
      const folder = 'student_photos'; // Change this to your desired folder
      const filePath = `${folder}/${filename}`;

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, filePath);

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, req.file.buffer, { contentType: req.file.mimetype });
      
      // Get the download URL for the uploaded file
      const publicUrl = await getDownloadURL(storageRef);

      formData.photo = publicUrl;

      // Save student data
      const admissionYear = new Date().getFullYear();
      const lastStudent = await Student.findOne().sort({ _id: -1 }).limit(1);

      let nextAdmissionId;
      if (lastStudent) {
        const lastAdmissionId = lastStudent.admissionId.split('/')[0];
        const nextAdmissionNumber = parseInt(lastAdmissionId) + 1;
        nextAdmissionId = `${nextAdmissionNumber}/${admissionYear}`;
      } else {
        nextAdmissionId = `1000/${admissionYear}`;
      }
      formData.admissionId = nextAdmissionId;

      if (formData.plusTwo?.registerNo) {
        const existingStudent = await Student.findOne({ 'plusTwo.regNo': formData.plusTwo.registerNo });
        if (existingStudent) {
          return res.status(400).json({ error: 'Duplicate register number' });
        }
      }

      const newStudent = new Student(formData);
      await newStudent.save();
      res.status(201).json({ message: 'Data saved successfully' });
    } else {
      res.status(400).json({ error: 'Photo file is required' });
    }
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
