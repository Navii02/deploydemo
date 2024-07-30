const express = require('express');
const router = express.Router();
const Principal = require('../../models/Principal/PrincipalSchema');
const HOD = require('../../models/Principal/HODDetail');
const ClassTutor = require('../../models/Tutor/TutorSchema');
const Faculty = require('../../models/hod/TeachersDetailSchema');
const Officer = require('../../models/Admin/OfficersDetailSchema');
const Student = require('../../models/Officer/ApprovedStudents');

// Route to fetch user statistics
router.get('/user/stats', async (req, res) => {
  try {
    // Query each schema separately to get the count of users for each role
    const principalCount = await Principal.countDocuments();
    const hodCount = await HOD.countDocuments();
    const classTutorCount = await ClassTutor.countDocuments();
    const facultyCount = await Faculty.countDocuments();
    const officerCount = await Officer.countDocuments();
    const studentCount = await Student.countDocuments();

    // Construct the stats object
    const statsObject = {
      totalUsers: principalCount + hodCount + classTutorCount + facultyCount + officerCount + studentCount,
      principal: principalCount,
      hod: hodCount,
      classTutor: classTutorCount,
      faculty: facultyCount,
      officer: officerCount,
      student: studentCount,
    };

    res.json(statsObject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
