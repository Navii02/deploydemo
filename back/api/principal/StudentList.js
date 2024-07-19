const express = require('express');
const Student = require('../../models/Officer/ApprovedStudents');
const Alumni = require('../../models/Officer/Alumni'); // Assuming Alumni schema is defined

const router = express.Router();

// API route to fetch students from approvedStudent collection
router.get('/principal/student', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API route to fetch alumni from alumni collection
router.get('/principal/alumni', async (req, res) => {
  try {
      const { course, year } = req.query;
      const query = {};
      if (course) query.course = course;
      if (year) query.academicyear = academicyear;
      const alumni = await Alumni.find(query);
      res.json(alumni);
  } catch (error) {
      console.error('Error fetching alumni data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
