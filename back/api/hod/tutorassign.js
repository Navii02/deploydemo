// routes/tutors.js
const express = require('express');
const router = express.Router();
const Tutor = require('../../models/hod/TeachersDetailSchema');

// Fetch tutors by department
router.get('/tutors', async (req, res) => {
  const department = req.query.department; // Extract department from query parameter
  try {
    let tutors;
    if (department) {
      tutors = await Tutor.find({ branches: department }); // Filter tutors by department (branches)
    } else {
      tutors = await Tutor.find(); // Fetch all tutors if no department specified
    }
    res.json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assign tutor for academic year
router.post('/tutors/assign', async (req, res) => {
  const { tutorId, academicYear } = req.body;
  
  try {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    // Update tutor's academic year
    tutor.academicYear = academicYear;
    await tutor.save();

    res.json({ message: 'Tutor assigned successfully', tutor });
  } catch (error) {
    console.error('Error assigning tutor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
