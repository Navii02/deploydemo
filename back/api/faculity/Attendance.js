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

// Route to fetch students based on semester, course, and optional lab
router.post('/attendance/fetch', async (req, res) => {
  const { course, semester, lab } = req.body;

  try {
    const query = { course, semester };
    if (lab) {
      query.lab = lab;
    }

    const students = await Student.find(query);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Route to mark attendance
// Route to mark attendance
// Route to mark attendance
router.post('/attendance', async (req, res) => {
  const { studentId, date, subject, hour, teachername, attendance, course, lab } = req.body;

  try {
    // Fetch the student
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if there's any attendance record that matches the criteria
    const existingAttendanceIndex = student.attendance.findIndex(
      record => record.date === date &&
                record.subject === subject &&
                record.hour === hour &&
                record.teachername === teachername &&
                (!lab || record.lab === lab) // Ensure lab is matched if provided
    );

    if (existingAttendanceIndex !== -1) {
      // Update existing record
      student.attendance[existingAttendanceIndex].status = attendance;
    } else {
      // Add new record if it does not exist
      student.attendance.push({ date, subject, hour, teachername, status: attendance, ...(lab && { lab }) });
    }

    // Update subject percentage
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
    res.json({ message: 'Attendance updated successfully!' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Route to check if attendance is already marked
// Route to check if attendance is already marked
router.post('/attendance/check', async (req, res) => {
  const { date, hour, teachername, subject, course, lab } = req.body;

  try {
    const query = {
      'attendance.date': date,
      'attendance.hour': hour,
      course,
    };

    if (lab) {
      query.lab = lab;
    }

    // Check if attendance is already marked for the same subject and hour
    const existingSubjectAttendance = await Student.findOne({
      ...query,
      'attendance.subject': subject,
      'attendance.teachername': teachername
    });

    if (existingSubjectAttendance) {
      return res.json({ 
        isMarked: true, 
        type: 'sameSubject',
        message: 'Attendance already marked for the same subject in this hour.',
        data: existingSubjectAttendance.attendance.find(record => record.date === date && record.hour === hour && record.subject === subject)
      });
    }

    // Check if attendance is already marked for a different subject but in the same hour
    const existingDifferentSubjectAttendance = await Student.findOne({
      ...query,
      'attendance.subject': { $ne: subject },
      'attendance.teachername': teachername
    });

    if (existingDifferentSubjectAttendance) {
      return res.json({ 
        isMarked: true, 
        type: 'differentSubject', 
        message: 'Attendance already marked for a different subject in this hour by the same teacher.' 
      });
    }

    // Check if attendance is marked by a different teacher
    const existingAttendanceByOtherTeacher = await Student.findOne({
      ...query,
      'attendance.hour': hour,
      'attendance.teachername': { $ne: teachername }
    });

    if (existingAttendanceByOtherTeacher) {
      return res.json({ 
        isMarked: true, 
        type: 'differentTeacher', 
        message: 'Attendance already marked for this hour by another teacher.' 
      });
    }

    res.json({ isMarked: false });
  } catch (error) {
    console.error('Error checking attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to fetch existing attendance records
router.post('/attendance/existing', async (req, res) => {
  const { date, hour, teachername, subject, course, lab } = req.body;

  try {
    const query = {
      'attendance.date': date,
      'attendance.hour': hour,
      'attendance.teachername': teachername,
      'attendance.subject': subject,
      course
    };

    if (lab) {
      query.lab = lab;
    }

    const students = await Student.find(query);

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


// Route to get attendance summary
router.post('/attendance/summary', async (req, res) => {
  const { course, semester, subject } = req.body;

  try {
    const students = await Student.find({ semester, course, 'attendance.subject': subject });
    const attendanceData = students.map(student => {
      const attendanceRecords = student.attendance.filter(record => record.subject === subject);
      const presentCount = attendanceRecords.filter(record => record.status === 'Present').length;
      const absentCount = attendanceRecords.filter(record => record.status === 'Absent').length;

      const absentDetails = attendanceRecords
        .filter(record => record.status === 'Absent')
        .map(record => ({
          date: record.date,
          hour: record.hour,
        }));

      const total = presentCount + absentCount;
      const subjectPercentageRecord = student.subjectPercentages.find(record => record.subject === subject);
      const percentage = subjectPercentageRecord ? subjectPercentageRecord.percentage : 0;

      return {
        studentId: student._id,
        attendance: {
          present: presentCount,
          absent: absentCount,
          total,
          percentage,
          absentDetails,
        },
      };
    });

    res.json({ students, attendance: attendanceData });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/attendance/summary/monthly', async (req, res) => {
  const { course, semester, subject, startDate, endDate } = req.body;

  // Validate the input dates
  if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ error: 'Invalid date range' });
  }

  try {
    // Find students based on course and semester
    const students = await Student.find({ course, semester });

    const attendanceData = students.map(student => {
      // Filter attendance records by subject and date range
      const filteredAttendance = student.attendance
        .filter(a => a.subject === subject && new Date(a.date) >= new Date(startDate) && new Date(a.date) <= new Date(endDate));
      
      // Calculate attendance summary
      const attendance = filteredAttendance.reduce((acc, curr) => {
        acc.present += curr.status === 'Present' ? 1 : 0;
        acc.absent += curr.status === 'Absent' ? 1 : 0;
        acc.total += 1;
        if (curr.status === 'Absent') {
          acc.absentDetails.push({ date: curr.date, hour: curr.hour });
        }
        return acc;
      }, { present: 0, absent: 0, total: 0, absentDetails: [] });

      // Calculate percentage
      const percentage = attendance.total > 0 ? ((attendance.present / attendance.total) * 100).toFixed(2) : '0.00';

      return {
        studentId: student._id,
        attendance: {
          present: attendance.present,
          absent: attendance.absent,
          total: attendance.total,
          percentage,
          absentDetails: attendance.absentDetails
        }
      };
    });

    res.json({ students, attendance: attendanceData });
  } catch (error) {
    console.error('Error fetching monthly attendance summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
