// routes/assignmentRoutes.js

const express = require('express');
const router = express.Router();
const Assignment = require('../../models/Faculity/AssignmentSchema');
const Teacher = require('../../models/Faculity/FaculitySchema');

router.use(express.json());

// Endpoint to handle assignment submissions
router.post('/assignments', async (req, res) => {
  const { branch, semester, subject, teacherName, assignmentDetails } = req.body;

  try {
    console.log('Received Branch Value:', branch); 
    const newAssignment = new Assignment({
      branch,
      semester,
      subject,
      teacherName,
      assignmentDetails,
    });

    const savedAssignment = await newAssignment.save();
    res.json(savedAssignment);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting assignment details' });
  }
});
router.get('/teacher/by-email/:email', async (req, res) => {
    const { email } = req.params;
  
    try {
      const teacher = await Teacher.findOne({ email });
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      res.json({ teacherName: teacher.name });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teacher name' });
    }
  });

module.exports = router;
