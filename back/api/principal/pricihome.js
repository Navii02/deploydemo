
const express = require('express');
const router = express.Router();
const Officer = require('../../models/Admin/OfficersDetailSchema');
const Student = require('../../models/Officer/ApprovedStudents');
const Teacher = require('../../models/hod/TeachersDetailSchema');


// Route to get total students
router.get('/total-students', async (req, res) => {
    try {
      const totalStudents = await Student.countDocuments();
      res.json({ totalStudents });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching total students' });
    }
  });
  
  // Route to get total officers
  router.get('/total-officers', async (req, res) => {
    try {
      const totalOfficers = await Officer.countDocuments();
      res.json({ totalOfficers });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching total officers' });
    }
  });
  
  // Route to get total teachers
  router.get('/total-teachers', async (req, res) => {
    try {
      const totalTeachers = await Teacher.countDocuments();
      res.json({ totalTeachers });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching total teachers' });
    }
  });
  module.exports = router;