const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema');

// Fetch tutors by department
router.get('/tutors', async (req, res) => {
  try {
    const department = req.query.department; // Extract department from query parameter
    let tutors;

    if (department) {
      // Filter tutors by department (branches) if department is specified
      tutors = await Teacher.find({ branches: department });
    } else {
      // Fetch all tutors if no department specified
      tutors = await Teacher.find();
    }

    res.json(tutors.map(tutor => ({ _id: tutor._id, name: tutor.teachername })));
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assign tutor for academic year
router.post('/tutors/assign', async (req, res) => {
  try {
    const { tutorId, academicYear, course } = req.body;
  
    const tutor = await Teacher.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    // Update tutor's academic year and course
    tutor.academicYear = academicYear;
    tutor.course = course;
    tutor.tutorassigned = true;
    await tutor.save();

    res.json({ message: 'Tutor assigned successfully', tutor: { _id: tutor._id, name: tutor.teachername } });
  } catch (error) {
    console.error('Error assigning tutor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
