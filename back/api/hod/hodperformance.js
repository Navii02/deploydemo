const express = require('express');
const router = express.Router();
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');

// GET student performance data by course (branch)
router.get('/student-performance/:course', async (req, res) => {
  const course = req.params.course;

  try {
    const students = await ApprovedStudent.find({ course: course });
    if (!students) {
      return res.status(404).json({ message: 'Students not found' });
    }
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
