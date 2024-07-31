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



const calculateAttendancePercentage = (attendanceRecords, subject) => {
  const totalClasses = attendanceRecords.filter(record => record.subject === subject).length;
  const attendedClasses = attendanceRecords.filter(record => record.subject === subject && record.status === 'Present').length;
  const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
  return percentage / 10; // Divide the percentage by 10
};

router.get('/students/faculty/:course/:semester/:subject', async (req, res) => {
  try {
    const { course, semester, subject } = req.params;

    // Fetch students' internal marks
    const students = await Student.find({ course, semester });

    // Fetch students' attendance records
    const attendanceRecords = await Student.find({ course, semester });

    // Process the data
    const filteredStudents = students.map(student => {
      // Find internal marks for the given subject
      const internalMark = student.internalMarks.find(mark => mark.subject === subject);

      // Find the corresponding attendance record
      const attendanceRecord = attendanceRecords.find(record => record._id.equals(student._id));
      const attendancePercentage = attendanceRecord ? calculateAttendancePercentage(attendanceRecord.attendance, subject) : 0;

      return {
        _id: student._id,
        RollNo:student.RollNo,
        name: student.name,
        course: student.course,
        semester: student.semester,
        subjectMarks: internalMark || {
          subject,
          examMarks1: 0,
          examMarks2: 0,
          assignmentMarks1: 0,
          assignmentMarks2: 0,
          attendance: 0,
          internalExam: 0,
          record: 0,
          totalMarks: 0
        },
        attendancePercentage // Add attendance percentage to the response
      };
    });

    res.json(filteredStudents);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

router.post('/marks/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const {
    subject,
    examMarks1,
    examMarks2,
    assignmentMarks1,
    assignmentMarks2,
    attendance,
    internalExam = 0,  // Default value if not provided
    record = 0,        // Default value if not provided
    totalMarks
  } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (student) {
      const internalMark = student.internalMarks.find(mark => mark.subject === subject);
      if (internalMark) {
        // Update existing internal mark entry
        internalMark.examMarks1 = examMarks1;
        internalMark.examMarks2 = examMarks2;
        internalMark.assignmentMarks1 = assignmentMarks1;
        internalMark.assignmentMarks2 = assignmentMarks2;
        internalMark.attendance = attendance;
        internalMark.internalExam = internalExam;
        internalMark.record = record;
        internalMark.totalMarks = totalMarks;
      } else {
        // Add new internal mark entry
        student.internalMarks.push({
          subject,
          examMarks1,
          examMarks2,
          assignmentMarks1,
          assignmentMarks2,
          attendance,
          internalExam,
          record,
          totalMarks
        });
      }
      await student.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;