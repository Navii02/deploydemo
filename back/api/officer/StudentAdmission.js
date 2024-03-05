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
    const studentName = req.body.name || 'unknown';
    const filename = `${studentName.replace(/\s/g, '_')}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

// Express middleware to handle file upload
router.post('/studentAdmission', upload.single('photo'), async (req, res) => {
  try {
    const formData = req.body;
    formData.photoPath = req.file ? req.file.path : null;

    const lastStudent = await Student.findOne().sort({ field: 'asc', _id: -1 }).limit(1);

    let nextAdmissionId;
    if (lastStudent) {
      // Extract the last admission ID and increment it by one
      const lastAdmissionId = parseInt(lastStudent.admissionId.split('/')[0], 10);
      nextAdmissionId = `${lastAdmissionId + 1}/${new Date().getFullYear()}`;
    } else {
      // If no previous admission, start from a default number
      nextAdmissionId = '1000/' + new Date().getFullYear();
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
    res.json({ student });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/approve/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const approvedStudent = new ApprovedStudent(student.toJSON());
    await approvedStudent.save();

    await Student.findByIdAndRemove(studentId);

    res.json({ message: 'Student Approved and Moved to Students Collection' });
  } catch (error) {
    console.error('Error approving student:', error);
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
router.get('/approvedStudents', async (req, res) => {
  try {
    const approvedStudents = await ApprovedStudent.find();
    res.json(approvedStudents);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/removedStudents', async (req, res) => {
  try {
    const removedStudents = await NotAdmittedStudent.find();
    res.json(removedStudents);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/studentDetails/:id', async (req, res) => {
  const admissionId = req.params.id;
  
  try {
    const approvedStudent = await ApprovedStudent.findOne({ admissionId });
    const removedStudent = await NotAdmittedStudent.findOne({ admissionId });

    if (approvedStudent) {
      res.json({ studentDetails: approvedStudent });
    } else if (removedStudent) {
      res.json({ studentDetails: removedStudent });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve the uploaded photos statically
router.use('/uploads', express.static('uploads'));

module.exports = router;