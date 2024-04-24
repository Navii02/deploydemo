// routes/students.js
const express = require('express');
const router = express.Router();
const Student = require('../../models/Officer/ApprovedStudents'); // Import your Student model

// Fetch students by department and academic year
router.get('/tutor', async (req, res) => {
  const course = req.query.department;
  const academicYear = req.query.academicYear;
  
  try {
    const students = await Student.find({ course, academicYear });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update student details
router.put('/students/:studentId', async (req, res) => {
  const studentId = req.params.studentId;
  const updatedData = req.body;

  try {
    // Ensure that 'updatedData' includes the new email field (e.g., 'collegemai')
    const updatedStudent = await Student.findByIdAndUpdate(studentId, updatedData, { new: true });
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add secondary email to student (saved in 'collegemai' field)
router.post('/students/:studentId/emails', async (req, res) => {
  const studentId = req.params.studentId;
  const { email } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $addToSet: { collegemail: email } }, // Use $addToSet to prevent duplicate emails
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    console.error('Error adding email to student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
