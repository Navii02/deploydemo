// Backend code (assuming you're using Node.js with Express)
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


// Route to fetch students based on semester and course
router.get('/students/faculty/:course/:semester', async (req, res) => {
  const { course, semester } = req.params;

  try {
    const students = await Student.find({ course: course, semester: semester });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
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

    const existingMarkIndex = student.internalMarks.findIndex(mark => mark.subject === subject);

    if (existingMarkIndex > -1) {
      student.internalMarks[existingMarkIndex] = {
        subject,
        ...marks,
        totalMarks: marks.examMarks + marks.assignmentMarks + marks.attendancePercentage
      };
    } else {
      const totalMarks = marks.examMarks + marks.assignmentMarks + marks.attendancePercentage;
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
