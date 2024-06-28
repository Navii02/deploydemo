const express = require('express');
const app = express();
const HodProfile = require('../../models/Principal/HODDetail'); // Assuming model name
const Teacher = require('../../models/hod/TeachersDetailSchema'); // Assuming model name

app.get('/hod-profile', async (req, res) => {
  const email = req.query.email;

  try {
    const hodProfile = await HodProfile.findOne({ email });
    if (!hodProfile) {
      return res.status(404).json({ message: 'HOD profile not found.' });
    }

    // Fetch teachers associated with the HOD's department
    const department = hodProfile.department;
    const teachers = await Teacher.find({ department: department }).select('department');

    // Count the number of teachers in the department
    const teacherCounts = teachers.length;

    // Enrich HOD profile with teacher counts
    const enrichedProfile = {
      ...hodProfile.toObject(), // Spread operator for other HOD profile data
      teacherCounts, // Include the teacher counts for the department
    };

    res.json(enrichedProfile);
  } catch (error) {
    console.error('Error fetching HOD profile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = app;
