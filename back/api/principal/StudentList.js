
const express = require('express');


const Student = require('../../models/Officer/ApprovedStudents');

const router = express.Router();
// API route to fetch students from approvedStudent collection
router.get('/principal/student', async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (error) {
      console.error('Error fetching student data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
module.exports = router;