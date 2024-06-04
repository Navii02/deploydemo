const express = require('express');
const router = express.Router();
const Student = require('../../models/Officer/ApprovedStudents'); // Assuming model name

router.get('/students/:branch', async (req, res) => {
  try {
    const branch = req.params.branch.toUpperCase(); // Convert branch to uppercase for case-insensitive matching

    // Define a mapping function to translate branches to corresponding courses (modify as needed)
    const courseMapping = {
      'CSE': ['B.Tech CSE', 'M.Tech CSE','MCA','BBA','BCA',], // Example mapping for CSE branch
      // Add mappings for other branches
      // ... Add mappings for other branches
    };

    const courses = courseMapping[branch] || []; // Use default empty array if branch not found

    const students = await Student.find({ course: { $in: courses } }); // Filter students based on mapped courses

    res.json({ students });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
