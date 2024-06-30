const express = require('express');
const app = express ();
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');


app.post('/fetch-installments', async (req, res) => {
    const { email, course } = req.body;
  
    try {
      const student = await ApprovedStudent.findOne({ email, course });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json({
        course: student.course,
        installmentsPaid: student.installmentsPaid || [],
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  module.exports = app;




  