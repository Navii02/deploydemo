const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema');
const HodDetails = require('../../models/Principal/HODDetail'); // Assuming HodDetails schema exists

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

// Route to fetch all HODs (including details from HodDetails)
router.get('/hod/hods', async (req, res) => {
  try {
    const hods = await Teacher.find({ isHOD: true });
    // Include details from HodDetails for enriched data
    const hodsWithDetails = await Promise.all(
      hods.map(async (hod) => {
        const hodDetails = await HodDetails.findOne({ teacherId: hod._id });
        return { ...hod.toObject(), ...hodDetails };
      })
    );
    res.status(200).json(hodsWithDetails);
  } catch (error) {
    console.error('Error fetching HODs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to assign a teacher as HOD and create details in HodDetails
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

    // **Corrected Line:** Save the updated teacher document **before** creating HodDetails
    await teacher.save();

    // Create corresponding entry in HodDetails (assuming data is available)
    const newHodDetails = new HodDetails({
    
      teachername: teacher.teachername,
      email: teacher.email,
      subjects: teacher.subjects,
      subjectCode: teacher.subjectCode,
      branches: teacher.branches,
      semesters: teacher.semesters,
      course: teacher.course,

      // Add other relevant HOD details here (e.g., department, designation)
    });
    await newHodDetails.save();

    res.status(200).json({
      message: 'Teacher assigned as HOD successfully',
      teachername: teacher.teachername,
    });
  } catch (error) {
    console.error('Error assigning HOD:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
