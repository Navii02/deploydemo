const express = require('express');
const router = express.Router();
const ApprovedStudents = require('../../models/Officer/ApprovedStudents'); // Import your ApprovedStudents model

// Route to fetch tutor messages (updates) by user email
router.get('/reminders/updates/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Find the ApprovedStudents document for the specified user email
    const student = await ApprovedStudents.findOne({ email: userEmail });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get the tutor updates from the student document
    const updates = student.tutormessage || []; // Assuming tutorUpdates is the field in your schema

    res.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ message: 'Error fetching updates' });
  }
});

module.exports = router;
