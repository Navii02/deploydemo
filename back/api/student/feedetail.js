// routes/installmentRoutes.js
const express = require('express');
const router = express.Router();
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');

// Route to fetch installments
router.post('/fetch-installments', async (req, res) => {
  const { email, course } = req.body;

  try {
    const student = await ApprovedStudent.findOne({ email, course });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ installmentsPaid: student.installmentsPaid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
