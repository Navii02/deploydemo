const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema');

// Fetch tutors by department
router.get('/tutors', async (req, res) => {
  try {
    const department = req.query.department;
    //console.log(department);
    const tutors = await Teacher.find({ department: department, tutorassigned: false });
    res.json(tutors.map(tutor => ({ _id: tutor._id, name: tutor.teachername })));
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Assign tutor for academic year
router.post('/tutors/assign', async (req, res) => {
  try {
    const { tutorId, academicYear, tutorclass } = req.body;
    const tutor = await Teacher.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const existingTutor = await Teacher.findOne({ tutorclass, tutorassigned: true, academicYear });
    if (existingTutor && existingTutor._id.toString() !== tutorId) {
      existingTutor.tutorassigned = false;
      await existingTutor.save();
    }

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
    const department = req.query.department;
    const query = { department: department, tutorassigned: true };
    const tutors = await Teacher.find(query);
    res.json(tutors.map(tutor => ({ _id: tutor._id, name: tutor.teachername, academicYear: tutor.academicYear, tutorclass: tutor.tutorclass })));
  } catch (error) {
    console.error('Error fetching assigned tutors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
