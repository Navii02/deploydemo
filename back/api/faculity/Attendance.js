const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema');
const Student = require('../../models/Officer/ApprovedStudents');

// Function to calculate percentage
function calculatePercentage(student, subject) {
  const subjectAttendance = student.attendance.filter(record => record.subject === subject);
  const totalDays = subjectAttendance.length;
  const presentDays = subjectAttendance.filter(record => record.status === 'Present').length;
  return totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);
}

// Route to fetch courses, semesters, and subjects based on the teacher's email
router.post('/data/attendance', async (req, res) => {
  const { email } = req.body;

  try {
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const { subjects, semesters, branches, teachername } = teacher;
    res.json({ subjects, semesters, branches, teachername });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch students based on semester and course
router.get('/students/faculty/attendance/:course/:semester', async (req, res) => {
  const { course, semester } = req.params;

  try {
    const students = await Student.find({ course, semester });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});


router.post('/attendance', async (req, res) => {
  const { studentId, date, subject, hour, teachername, attendance } = req.body;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const existingAttendance = student.attendance.find(
      record => record.date === date && record.subject === subject && record.hour === hour && record.teachername === teachername
    );

    if (existingAttendance) {
      existingAttendance.status = attendance;
    } else {
      student.attendance.push({ date, subject, hour, teachername, status: attendance });
    }

    let foundSubjectPercentage = false;
    for (let i = 0; i < student.subjectPercentages.length; i++) {
      if (student.subjectPercentages[i].subject === subject) {
        student.subjectPercentages[i].percentage = calculatePercentage(student, subject);
        foundSubjectPercentage = true;
        break;
      }
    }

    if (!foundSubjectPercentage) {
      student.subjectPercentages.push({ subject, percentage: calculatePercentage(student, subject) });
    }

    await student.save();
    res.json({ message: 'Attendance marked successfully!' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/attendance/check', async (req, res) => {
  const { date, hour, teachername, subject } = req.body;

  try {
    const existingAttendance = await Student.findOne({
      'attendance.date': date,
      'attendance.hour': hour,
      'attendance.teachername': teachername,
      'attendance.subject': subject,
    });

    if (existingAttendance) {
      res.json({ isMarked: true, teachername, markedSubject: subject });
    } else {
      const differentSubjectAttendance = await Student.findOne({
        'attendance.date': date,
        'attendance.hour': hour,
        'attendance.teachername': { $ne: teachername },
      });

      if (differentSubjectAttendance) {
        res.json({ isMarked: true, markedSubject: differentSubjectAttendance.attendance.subject });
      } else {
        res.json({ isMarked: false });
      }
    }
  } catch (error) {
    console.error('Error checking attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/attendance/existing', async (req, res) => {
  const { date, hour, teachername, subject } = req.body;

  try {
    const students = await Student.find({
      'attendance.date': date,
      'attendance.hour': hour,
      'attendance.teachername': teachername,
      'attendance.subject': subject,
    });

    const existingAttendance = students.map(student => {
      const record = student.attendance.find(att => att.date === date && att.hour === hour && att.teachername === teachername && att.subject === subject);
      return {
        student: { _id: student._id, name: student.name },
        status: record ? record.status : 'Not Found',
      };
    });

    res.json(existingAttendance);
  } catch (error) {
    console.error('Error fetching existing attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/attendance/summary', async (req, res) => {
  const { course, semester, subject } = req.body;

  try {
    const students = await Student.find({ semester, course, 'attendance.subject': subject });
    const attendanceData = students.map(student => {
      const attendanceRecords = student.attendance.filter(record => record.subject === subject);
      const presentCount = attendanceRecords.filter(record => record.status === 'Present').length;
      const absentCount = attendanceRecords.filter(record => record.status === 'Absent').length;

      // Collect absent dates and hours for the subject
      const absentDetails = attendanceRecords
        .filter(record => record.status === 'Absent')
        .map(record => ({
          date: record.date,
          hour: record.hour,
        }));

      const total = presentCount + absentCount;

      // Find the subject-specific attendance percentage
      const subjectPercentageRecord = student.subjectPercentages.find(record => record.subject === subject);
      const percentage = subjectPercentageRecord ? subjectPercentageRecord.percentage : 0;

      return {
        studentId: student._id,
        attendance: {
          present: presentCount,
          absent: absentCount,
          total,
          percentage,
          absentDetails, // Include absent details in the response
        },
      };
    });

    res.json({ students, attendance: attendanceData });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
