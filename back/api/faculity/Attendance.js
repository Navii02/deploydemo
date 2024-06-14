const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema');
const Student = require('../../models/Officer/ApprovedStudents');

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

// Route to submit attendance
// In Attendance.js


router.post('/attendance', async (req, res) => {
  const { studentId, date, subject, hour, teachername, attendance } = req.body;

  try {
    // Fetch the student from the database
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if attendance for this student on this date, subject, and hour already exists
    const existingAttendance = student.attendance.find(
      record => record.date === date && record.subject === subject && record.hour === hour
    );

    if (existingAttendance) {
      // If attendance already exists, update the status
      existingAttendance.status = attendance;
    } else {
      // Otherwise, add a new attendance record directly
      student.attendance.push({ date, subject, hour, teachername, status: attendance });
    }

    // Update or create subject percentage
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

    // Save the updated student record
    await student.save();
    res.json({ message: 'Attendance marked successfully!' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


function calculatePercentage(student, subject) {
  const subjectAttendance = student.attendance.filter(record => record.subject === subject);
  const totalDays = subjectAttendance.length;
  const presentDays = subjectAttendance.filter(record => record.status === 'Present').length;
  return totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);
}


// Route to check existing attendance
// Route to check existing attendance
// Route to check existing attendance
// Route to check existing attendance
// Backend Route to check existing attendance
// Backend Route to check existing attendance
router.post('/attendance/check', async (req, res) => {
  const { date, subject, hour, course, semester, teachername } = req.body;

  try {
      const students = await Student.find({ course, semester });

      // Check if attendance for the specified hour and subject is marked by another teacher
      const existingAttendance = students.some(student => {
          const attendanceRecord = student.attendance.find(
              record => record.date === date && record.subject === subject && record.hour === hour
          );

          // If attendance is marked and by another teacher, return true
          return attendanceRecord && attendanceRecord.teachername !== teachername;
      });

      if (existingAttendance) {
          // If attendance is marked by another teacher, return that teacher's name
          const hourMarkedBy = students
              .filter(student => {
                  const attendanceRecord = student.attendance.find(
                      record => record.date === date && record.subject === subject && record.hour === hour
                  );
                  return attendanceRecord && attendanceRecord.teachername !== teachername;
              })
              .map(student => student.teachername)
              .join(', '); // You can join multiple teachers if needed

          return res.json({ hourMarkedBy });
      }

      // If attendance is not marked by another teacher, return empty response
      res.json([]);
  } catch (error) {
      console.error('Error checking attendance:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to save attendance percentage for a student
// Route to save attendance percentage for a student
router.post('/students/save-attendance-percentage', async (req, res) => {
    const { studentId, subject } = req.body;

    try {
        // Fetch the student from the database
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Calculate the attendance percentage for the given subject
        const subjectAttendance = student.attendance.filter(record => record.subject === subject);
        const totalDays = subjectAttendance.length;
        const presentDays = subjectAttendance.filter(record => record.status === 'Present').length;
        const percentage = totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

        // Find the subjectPercentage record for the subject
        let subjectPercentage = student.subjectPercentages.find(record => record.subject === subject);

        // If subjectPercentage doesn't exist, create a new one
        if (!subjectPercentage) {
            subjectPercentage = { subject, percentage }; // Include the calculated percentage
            student.subjectPercentages.push(subjectPercentage);
        } else {
            // Update the percentage for the subject
            subjectPercentage.percentage = percentage; // Update with the calculated percentage
        }

        // Save the updated student record
        await student.save();
        res.json({ message: 'Attendance percentage saved successfully' });
    } catch (error) {
        console.error('Error saving attendance percentage:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch attendance summary
router.post('/attendance/summary', async (req, res) => {
    const { branch, semester, subject } = req.body;
  
    try {
      const students = await Student.find({ semester, branch, 'attendance.subject': subject });
      const attendanceData = students.map(student => {
        const attendanceRecords = student.attendance.filter(record => record.subject === subject);
        const presentCount = attendanceRecords.filter(record => record.status === 'Present').length;
        const absentCount = attendanceRecords.filter(record => record.status === 'Absent').length;

        const total = presentCount + absentCount;
  
        // Find the subject-specific attendance percentage
        const subjectPercentageRecord = student.subjectPercentages.find(record => record.subject === subject);
        const percentage = subjectPercentageRecord ? subjectPercentageRecord.percentage : 0;
  
        return {
          studentId: student._id,
          attendance: {
            present: presentCount,
            absent: absentCount,
            total: presentCount + absentCount,
            total,
            percentage,
          }
        };
      });
  
      res.json({ students, attendance: attendanceData });
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;

