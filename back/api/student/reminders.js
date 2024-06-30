const express = require('express');
const router = express.Router();
const ApprovedStudents = require('../../models/Officer/ApprovedStudents'); // Import your ApprovedStudents model
const AssignmentReminder = require('../../models/Faculity/AssignmentSchema'); // Assuming AssignmentReminder is your Mongoose model

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
    const updates = student.tutormessage || []; // Assuming tutormessage is the field in your schema

    res.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    res.status(500).json({ message: 'Error fetching updates' });
  }
});

// Route to fetch assignment reminders based on course, semester, and current academic year
router.get('/reminders/assignments', async (req, res) => {
  const { course, semester, currentyear } = req.query;

  try {
    const reminders = await AssignmentReminder.find({
      course,
      semester,
      currentYear: currentyear // Ensure the field name matches your schema
    });

    res.json(reminders);
  } catch (err) {
    console.error('Error fetching assignment reminders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to fetch subject-wise attendance percentages
router.get('/reminders/attendance', async (req, res) => {
  const { email, course } = req.query;

  try {
    // Find the student by email and course
    const student = await ApprovedStudents.findOne({ email, course });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Extract subject percentages from the student document
    const subjectPercentages = student.subjectPercentages;

    res.status(200).json(subjectPercentages);
  } catch (error) {
    console.error('Error fetching subject-wise attendance percentages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch internal marks by user email and course
router.get('/reminders/internalmarks', async (req, res) => {
  const { email, course } = req.query;

  try {
    // Find the ApprovedStudent document for the specified user email and course
    const student = await ApprovedStudents.findOne({ email, course });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Extract internal marks from the student document
    const internalMarks = student.internalMarks;

    res.status(200).json(internalMarks);
  } catch (error) {
    console.error('Error fetching internal marks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch fee installment reminders based on semester
router.get('/reminders/feeinstallments', async (req, res) => {
  const { email, semester } = req.query;

  try {
    // Find the ApprovedStudent document for the specified user email and semester
    const student = await ApprovedStudents.findOne({ email, semester });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Determine which installment is due based on the semester
    let installmentDue = 0;
    switch (semester) {
      case '3':
        installmentDue = 1;
        break;
      case '5':
        installmentDue = 2;
        break;
      default:
        installmentDue = 0; // No installment due if semester doesn't match
    }

    // Check if the due installment is paid
    const installmentsPaid = student.installmentsPaid || [];
    const isInstallmentPaid = installmentsPaid.includes(installmentDue);

    if (!isInstallmentPaid) {
      res.status(200).json({ message: `Installment ${installmentDue} is due.` });
    } else {
      res.status(200).json({ message: `Installment ${installmentDue} is already paid.` });
    }
  } catch (error) {
    console.error('Error fetching fee installments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



