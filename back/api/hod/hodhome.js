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

    // Fetch courses associated with the HOD's department (assuming a field in HodProfile)
    const courses = await Teacher.find({ course: hodProfile.course }, 'course'); // Select only the 'course' field

    // Find teachers with the same courses (optimized for efficiency)
    const teacherCounts = {}; // Object to store course ID and count of teachers
    const teacherIds = courses.map((course) => course.course); // Extract course IDs directly
    const teachers = await Teacher.find({ course: { $in: teacherIds } })
      .select('course'); // Only select the 'course' field for efficiency

    teachers.forEach((teacher) => {
      const courseId = teacher.course.toString(); // Convert to string for object key
      teacherCounts[courseId] = (teacherCounts[courseId] || 0) + 1;
    });

    // Enrich HOD profile with teacher counts
    const enrichedProfile = {
      ...hodProfile.toObject(), // Spread operator for other HOD profile data
      courses, // Include the fetched courses
      teacherCounts, // Include the teacher counts for each course
    };

    res.json(enrichedProfile);
  } catch (error) {
    console.error('Error fetching HOD profile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = app;
