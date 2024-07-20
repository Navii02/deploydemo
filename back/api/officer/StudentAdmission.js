const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('../../firebase'); // Import Firebase Storage methods

const Student = require('../../models/Officer/StudentAdmission');

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to sanitize filenames
const sanitizeFilename = (name) => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

// Express middleware to handle file upload
router.put('/studentadmission', upload.single('photo'), async (req, res) => {
  try {
    const formData = req.body;
    let photoUrl = null;

    // Check if file was uploaded
    if (req.file) {
      const file = req.file.buffer;
      const fileId = new mongoose.Types.ObjectId();
      const studentName = sanitizeFilename(req.body.name || 'unknown'); // Fallback to 'unknown' if name is not provided
      const filename = `${studentName}_${fileId}${path.extname(req.file.originalname)}`;

      // Create a reference to the file in Firebase Storage
      const storageRef = ref(getStorage(), `students_photos/${filename}`);

      // Upload file to Firebase Storage
      await uploadBytes(storageRef, file);

      // Get the download URL
      photoUrl = await getDownloadURL(storageRef);
    }

    formData.photo = photoUrl;

    const admissionYear = new Date().getFullYear(); // Get the current year

    // Find the last admitted student to calculate the next admission ID
    const lastStudent = await Student.findOne().sort({ field: 'asc', _id: -1 }).limit(1);

    let nextAdmissionId;
    if (lastStudent) {
      // Extract the last admission ID and increment it by one
      const lastAdmissionId = lastStudent.admissionId.split('/')[0];
      const nextAdmissionNumber = parseInt(lastAdmissionId) + 1;
      nextAdmissionId = `${nextAdmissionNumber}/${admissionYear}`;
    } else {
      // If no previous admission, start from a default number
      nextAdmissionId = `1000/${admissionYear}`;
    }
    formData.admissionId = nextAdmissionId;

    // Check for duplicate register number in the "plusTwo" field
    if (formData.plusTwo && formData.plusTwo.registerNo) {
      const existingStudent = await Student.findOne({ 'plusTwo.registerNo': formData.plusTwo.registerNo });
      if (existingStudent) {
        return res.status(400).json({ error: 'Duplicate register number' });
      }
    }

    // Save the new student data to the database
    const newStudent = new Student(formData);
    await newStudent.save();

    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
