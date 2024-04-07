// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const Student = require('../../models/Officer/ApprovedStudents');

router.get('/students/:branch', async (req, res) => {
  try {
    const course = req.params.branch;
    const students = await Student.find({ course });
   // console.log('course:',course);
    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
