const express = require('express');
const router = express.Router();
const Student = require('../../models/Officer/ApprovedStudents');

// Route to fetch students based on department and academic year
router.get('/students/:department/:academicYear', async (req, res) => {
  const { department, academicYear } = req.params;

  try {
    const students = await Student.find({ course: department, academicYear });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Route to send message to selected students and save in tutormessage array
router.post('/sendMessage', async (req, res) => {
  const { selectedStudents, message } = req.body;

  try {
    // Update tutormessage array for selected students
    await Promise.all(
      selectedStudents.map(async (studentEmail) => {
        const student = await Student.findOne({ email: studentEmail });

        if (student) {
          // Ensure tutormessage is initialized as an array
          if (!Array.isArray(student.tutormessage)) {
            student.tutormessage = []; // Initialize as an empty array if not already an array
          }

          // Append the message to the tutormessage array
          student.tutormessage.push(message);
          await student.save();
        }
      })
    );

    res.status(200).json({ message: 'Message sent and saved successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;
