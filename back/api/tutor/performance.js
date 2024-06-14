// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const Student = require('../../models/Officer/ApprovedStudents');

router.use(express.json());

// Endpoint to fetch student performance data by academic year
router.get('/student-performance', async (req, res) => {
  const { academicYear } = req.query;

  try {
    const students = await Student.find({ academicYear });
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for the given academic year' });
    }

    const studentPerformance = students.map(student => {
      // Process internal marks and attendance percentage
      const subjectsPerformance = student.internalMarks.map(mark => {
        const subjectAttendance = student.subjectPercentages.find(subject => subject.subject === mark.subject);
        return {
          subject: mark.subject,
          internalMarks: mark.totalMarks,
          attendancePercentage: subjectAttendance ? subjectAttendance.percentage : 0,
        };
      });

      return {
        name: student.name,
        rollNumber: student.admissionNumber,
        subjects: subjectsPerformance,
      };
    });

    res.json(studentPerformance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student performance data' });
  }
});

module.exports = router;
