const express = require('express');
const router = express.Router();
const ApprovedStudents = require('../../models/Officer/ApprovedStudents'); // Import your ApprovedStudents model

// Route to fetch tutor messages (updates) by user email
router.get('/reminders/updates/:email', async (req, res) => {
  const Useremail = req.params.email;
  console.log(Useremail);
  

  try {
    // Find the ApprovedStudents document for the specified user email
    const student = await ApprovedStudents.findOne({ email:Useremail });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get the tutor messages (updates) from the student document
    const message = student.tutormessage || []; // If tutormessage is undefined, default to an empty array

    res.json(message);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ message: 'Error fetching updates' });
  }
});

module.exports = router;
