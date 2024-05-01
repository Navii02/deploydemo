const express = require('express');
const router = express.Router();
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');

// Routes

router.get('/officer/details', async (req, res) => {
  try {
    const students = await ApprovedStudent.find();
    res.json({ students });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to handle fee payments
router.post('/officer/fee-payment/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { installmentIndex } = req.body;

  try {
    const student = await ApprovedStudent.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if installmentIndex is valid and not already paid
    if (!student.installmentsPaid.includes(installmentIndex)) {
      student.installmentsPaid.push(installmentIndex);
      await student.save();
      res.status(200).json({ message: `Installment ${installmentIndex} paid successfully` });
    } else {
      res.status(400).json({ message: `Installment ${installmentIndex} already paid` });
    }
  } catch (error) {
    console.error('Error processing fee payment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
