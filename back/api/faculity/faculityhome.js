// teachers-profile.js
const express = require('express');
const FacultyProfile = require('../../models/hod/TeachersDetailSchema');

const app = express();

app.get('/teacher-profile', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email parameter is required' });
    }

    const facultyProfile = await FacultyProfile.findOne({ email });

    if (!facultyProfile) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }

    // Ensure that the field name is 'teachername' in both schema and response
    const { teachername, branches, semesters, subjects } = facultyProfile;
    res.status(200).json({ teachername, branches, semesters, subjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = app;
