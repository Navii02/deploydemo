const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema');
const HODDetail = require('../../models/Principal/HODDetail');

// Route to fetch teachers who are not yet assigned as HODs
router.get('/hod/teachers', async (req, res) => {
  try {
    // Find all teachers
    const allTeachers = await Teacher.find();

    // Find all HODs and extract their emails
    const hodEmails = await HODDetail.find({}, 'email');
    const hodEmailList = hodEmails.map(hod => hod.email);

    // Filter out teachers whose emails match with HOD emails
    const teachersNotHODs = allTeachers.filter(teacher => !hodEmailList.includes(teacher.email));

    res.status(200).json(teachersNotHODs);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/hod/hods', async (req, res) => {
    try {
      const hods = await HODDetail.find();
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
  
      const existingHOD = await HODDetail.findOne({ email: teacher.email });
      if (existingHOD) {
        return res.status(400).json({ error: 'Teacher is already assigned as HOD' });
      }

      // Generate a random customId
      const customId = generateRandomCustomId();
  
      // Create a new HOD record
      const newHOD = new HODDetail({
        teachername: teacher.teachername,
        email: teacher.email,
        branches: teacher.branches,
        semesters: teacher.semesters,
        name: teacher.name,

        customId: customId
      });
  
      // Save the new HOD record
      await newHOD.save();
  
      res.status(200).json({ message: 'Teacher assigned as HOD successfully', teachername: teacher.teachername });
    } catch (error) {
      console.error('Error assigning HOD:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Function to generate a random custom ID
function generateRandomCustomId() {
  return Math.floor(Math.random() * 1000);
}

module.exports = router;
