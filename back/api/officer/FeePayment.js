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

router.post('/officer/fee-payment/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { installmentIndex } = req.body;
  
  try {
    const student = await ApprovedStudent.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Ensure student.installments exists and installmentIndex is within bounds
    if (!student.installments || installmentIndex < 0 || installmentIndex >= student.installments.length) {
      return res.status(400).json({ message: 'Invalid installment index' });
    }

    // Update installment status
    student.installments[installmentIndex].status = 'Paid'; // No need to subtract 1 here
    student.installments[installmentIndex].paymentDate = new Date();
    await student.save();

    res.json({ message: 'Fee payment successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



module.exports = router;
