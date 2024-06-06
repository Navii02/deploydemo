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
      tutors = await Teacher.find({ course: department,tutorassigned: false });
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
// Assign tutor for academic year
router.post('/tutors/assign', async (req, res) => {
  try {
    const { tutorId, academicYear, tutorclass } = req.body;
  
    const tutor = await Teacher.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    // Check if there's any existing tutor with the same tutor class
    const existingTutor = await Teacher.findOne({ tutorclass: tutorclass, tutorassigned: true,academicYear:academicYear });
    if (existingTutor && existingTutor._id.toString() !== tutorId) {
      // If an existing tutor is found with the same tutor class,
      // set its tutorassigned status to false
      existingTutor.tutorassigned = false;
      await existingTutor.save();
    }

    // Update the new tutor's academic year and course
    tutor.academicYear = academicYear;
    tutor.tutorclass = tutorclass;
    tutor.tutorassigned = true;
    await tutor.save();

    res.json({ 
      message: 'Tutor assigned successfully', 
      tutor: { 
        _id: tutor._id, 
        name: tutor.teachername, 
        academicYear: tutor.academicYear, 
        tutorclass: tutor.tutorclass 
      } 
    });
  } catch (error) {
    console.error('Error assigning tutor:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/assigned-tutors', async (req, res) => {
  try {
    const course = req.query.department;
    //console.log('Department:', course);

    let query;
    if (course) {
      query = { course: course, tutorassigned: true };
    } else {
      query = { tutorassigned: true };
    }

    //console.log('Query:', query);

    const tutors = await Teacher.find(query);

    if (!tutors || tutors.length === 0) {
      return res.status(404).json({ error: 'No assigned tutors found' });
    }

    res.json(tutors.map(tutor => ({ _id: tutor._id, name: tutor.teachername, academicYear: tutor.academicYear, tutorclass: tutor.tutorclass })));
  } catch (error) {
    console.error('Error fetching assigned tutors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
