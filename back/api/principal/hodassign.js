const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema');

// Route to fetch teachers who are not yet assigned as HODs
router.get('/hod/teachers', async (req, res) => {
  try {
    // Find all teachers who are not HODs
    const teachersNotHODs = await Teacher.find({ isHOD: false });
    res.status(200).json(teachersNotHODs);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch all HODs
router.get('/hod/hods', async (req, res) => {
  try {
    const hods = await Teacher.find({ isHOD: true });
    res.status(200).json(hods);
  } catch (error) {
    console.error('Error fetching HODs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to assign a teacher as HOD
router.post('/hod/assign', async (req, res) => {
  try {
    const { teacherId } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (teacher.isHOD) {
      return res.status(400).json({ error: 'Teacher is already assigned as HOD' });
    }

    // Assign the teacher as HOD
    teacher.isHOD = true;
    await teacher.save();

    res.status(200).json({ message: 'Teacher assigned as HOD successfully', teachername: teacher.teachername });
  } catch (error) {
    console.error('Error assigning HOD:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
