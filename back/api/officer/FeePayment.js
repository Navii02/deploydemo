// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const Student = require('../../models/Officer/ApprovedStudents');

// Route to fetch all student details
router.get('/officer/details', async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to update fee payment status
router.post('/api/officer/fee-payment', async (req, res) => { // Corrected route path
  try {
    const { studentId, installmentIndex } = req.body;

    // Find the student by ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the payment status of the specified installment
    if (student.feeInstallments && student.feeInstallments.length > installmentIndex) {
      student.feeInstallments[installmentIndex].status = 'Paid';
      student.feeInstallments[installmentIndex].paymentDate = new Date();
      await student.save();
      res.status(200).json({ message: 'Fee payment status updated successfully', student });
    } else {
      res.status(400).json({ message: 'Invalid installment index or fee installments not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
