// routes/assignmentRoutes.js

const express = require('express');
const router = express.Router();
const Assignment = require('../../models/Faculity/AssignmentSchema');
const Teacher = require('../../models/hod/TeachersDetailSchema');

router.use(express.json());

// Endpoint to handle assignment submissions
router.post('/assignments', async (req, res) => {
  const { course, semester, subject, teachername, assignmentDetails,currentYear,submissionDate} = req.body;

  try {
   
    const newAssignment = new Assignment({
      course,
      semester,
      subject,
      teachername,
      assignmentDetails,
      currentYear,
      submissionDate,
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
      const { subjects, semesters, branches, teachername } = teacher;
      res.json({ subjects, semesters, branches, teachername });
      
      
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teacher name' });
    }
  });

module.exports = router;
