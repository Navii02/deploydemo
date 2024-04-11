// routes/students.js
const express = require('express');
const router = express.Router();
const Student = require('../../models/Officer/ApprovedStudents'); // Import your Student model

// Fetch students by department and academic year
router.get('/tutor', async (req, res) => {
 
  const course=req.query.department;
  const academicYear=req.query.academicYear;
  console.log(course,academicYear);

  try {
    const students = await Student.find({ course, academicYear });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
