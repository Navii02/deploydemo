// Import necessary modules
const express = require('express');
const router = express.Router();
const TeacherDetails = require('../../models/hod/TeachersDetailSchema');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents') // Adjust path as per your project structure

// Route to fetch teacher details by email
router.get('/tutor-profile', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter missing' });
    }

    // Query the database for teacher details based on email
    const teacher = await TeacherDetails.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Return the teacher details as JSON response
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/students-count', async (req, res) => {
    const { academicYear, course } = req.query;
    console.log(course,academicYear);
    try {
      const studentCount = await ApprovedStudent.countDocuments({ academicYear, course });
      res.json({ totalStudents: studentCount });
    } catch (error) {
      console.error('Error fetching student count:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
