// routes/student.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Student = require('../../models/Officer/StudentAdmission');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
const NotAdmittedStudent = require('../../models/Officer/NotApprovedstudents');

const router = express.Router();

// Multer storage configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'studentsphoto/'); // Save photos in the 'studentsphoto' folder
    },
    filename: function (req, file, cb) {
      // Use the student's name as the filename (assuming the name field is present in the request body)
      const studentName = req.body.name || 'unknown';
      const filename = `${studentName.replace(/\s/g, '_')}_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, filename);
    },
  });
  
  const upload = multer({ storage: storage });

// Express middleware to handle file upload
// routes/student.js
router.post('/studentAdmission', upload.single('photo'), async (req, res) => {
    try {
      const formData = req.body;
      formData.photoPath = req.file ? req.file.path : null;
  
      // Check if formData.plusTwo is defined before accessing its properties
      if (formData.plusTwo && formData.plusTwo.registerNo) {
        // Check if a document with the same registerNumber already exists
        const existingStudent = await Student.findOne({ 'plusTwo.registerNo': formData.plusTwo.registerNo });
  
        if (existingStudent) {
          // Handle duplicate entry as needed
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
  router.post('/approve/:id', async (req, res) => {
    const studentId = req.params.id;
  
    try {
      const student = await Student.findById(studentId);
  
      // Move the student to the 'students' collection
      // Create a new model for the 'Student' collection and save the student data
      
      const approvedStudent = new ApprovedStudent(student.toJSON());
      await approvedStudent.save();
  
      // Remove the student from the 'StudentAdmission' collection
      await Student.findByIdAndRemove(studentId);
  
      res.json({ message: 'Student Approved and Moved to Students Collection' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  router.post('/decline/:id', async (req, res) => {
    const studentId = req.params.id;
  
    try {
      const student = await Student.findById(studentId);
  
      // Move the student to the 'notAdmittedStudents' collection
      // Create a new model for the 'NotAdmittedStudent' collection and save the student data
     
      const notAdmittedStudent = new NotAdmittedStudent(student.toJSON());
      await notAdmittedStudent.save();
  
      // Remove the student from the 'StudentAdmission' collection
      await Student.findByIdAndRemove(studentId);
  
      res.json({ message: 'Student Declined and Moved to Not Admitted Students Collection' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Serve the uploaded photos statically
router.use('/uploads', express.static('uploads'));

module.exports = router;
