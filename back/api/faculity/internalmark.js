const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema');
const Student = require('../../models/Officer/ApprovedStudents');

// Route to fetch courses and semesters based on the teacher's email
router.post('/data', async (req, res) => {
  const { email } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const { subjects, semesters, branches } = teacher;

    res.json({ subjects, semesters, branches });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch students based on semester, course, and subject


// Route to get students' attendance percentage for a given course, semester, and subject
const calculateAttendancePercentage = (attendanceRecords, subject) => {
  const totalClasses = attendanceRecords.filter(record => record.subject === subject).length;
  const attendedClasses = attendanceRecords.filter(record => record.subject === subject && record.status === 'Present').length;

  return totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
};

// Endpoint to fetch students with their marks and attendance percentage
router.get('/students/faculty/:course/:semester/:subject', async (req, res) => {
  const { course, semester, subject } = req.params;

  try {
    // Fetch students based on course and semester
    const students = await Student.find({ course, semester });

    // Map students to include attendance percentage for the subject
    const studentsWithAttendance = students.map(student => {
      const attendancePercentage = calculateAttendancePercentage(student.attendance, subject);
      const attendance=attendancePercentage/10;
      
      return {
        ...student._doc,
        subjectMarks: {
          ...student.subjectMarks,
          attendance: attendance
        }
      };
    });

    res.json(studentsWithAttendance);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Error fetching students' });
  }
});

// Route to submit or update internal marks
router.post('/marks', async (req, res) => {
  const { studentId, subject, marks } = req.body;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find the index of the existing mark for the given subject
    const existingMarkIndex = student.internalMarks.findIndex(mark => mark.subject === subject);

    // Include totalMarks from marks object
    const totalMarks = marks.totalMarks;

    if (existingMarkIndex > -1) {
      student.internalMarks[existingMarkIndex] = {
        subject,
        ...marks,
        totalMarks
      };
    } else {
      student.internalMarks.push({ subject, ...marks, totalMarks });
    }

    await student.save();

    res.json({ message: 'Marks submitted successfully' });
  } catch (error) {
    console.error('Error submitting marks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
