import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./FacultyNavbar";

const AttendanceForm = () => {
  const [semester, setSemester] = useState('');
  const [course, setCourse] = useState('');
  const [subject, setSubject] = useState('');
  const [hour, setHour] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachername, setTeacherName] = useState('');
  const [loading, setLoading] = useState(false);
  const [markAllPresent, setMarkAllPresent] = useState(false);

  useEffect(() => {
    const fetchCoursesAndSemesters = async () => {
      const email = localStorage.getItem('email');

      try {
        const response = await axios.post('/api/data/attendance', { email });
        const { subjects, semesters, branches, teachername } = response.data;
        setCourses(branches || []);
        setSemesters(semesters || []);
        setSubjects(subjects || []);
        setTeacherName(teachername);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCoursesAndSemesters();

    // Set current date by default
    const currentDate = new Date().toISOString().split('T')[0];
    setDate(currentDate);
  }, []);

  const fetchStudents = async () => {
    if (!course || !semester || !subject || !hour || !date) {
        console.error('Please select a course, semester, subject, hour, and date');
        return;
    }

    try {
        const response = await axios.get(`/api/students/faculty/attendance/${course}/${semester}`);
        const fetchedStudents = response.data;

        const attendanceResponse = await axios.post('/api/attendance/check', {
            date,
            subject,
            hour,
            course,
            semester,
            teachername,
        });

        // Check if 'hourMarkedBy' is present in the response
        if ('hourMarkedBy' in attendanceResponse.data) {
            // If attendance for the specified hour is already marked by another teacher
            const markedByTeachers = attendanceResponse.data.hourMarkedBy;
            alert(`Attendance for this hour is already marked by ${markedByTeachers}.`);
            return; // Stop further processing
        }

        const attendanceData = attendanceResponse.data;
        const updatedStudents = fetchedStudents.map(student => {
            const attendanceRecord = attendanceData.find(record => record.studentId === student._id);
            return {
                ...student,
                attendance: attendanceRecord ? attendanceRecord.status : (markAllPresent ? 'Present' : 'Absent')
            };
        });

        setStudents(updatedStudents);
    } catch (error) {
        console.error('Error fetching students or checking attendance:', error);
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetchStudents();
    setLoading(false);
  };

  const handleAttendanceChange = (studentId, isPresent) => {
    setStudents(students.map(student =>
      student._id === studentId ? { ...student, attendance: isPresent ? 'Present' : 'Absent' } : student
    ));
  };

  const submitAttendance = async () => {
    try {
      await Promise.all(students.map(student =>
        axios.post('/api/attendance', {
          studentId: student._id,
          date,
          subject,
          hour,
          teachername,
          attendance: student.attendance
        })
      ));

      console.log('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const handleMarkAllPresentChange = (e) => {
    const isChecked = e.target.checked;
    setMarkAllPresent(isChecked);
    setStudents(students.map(student => ({
      ...student,
      attendance: isChecked ? 'Present' : 'Absent'
    })));
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <label>
          Course:
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </label>

        <label>
          Semester:
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="">Select Semester</option>
            {semesters.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </label>

        <label>
          Subject:
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </label>

        <label>
          Hour:
          <select value={hour} onChange={(e) => setHour(e.target.value)}>
            <option value="">Select Hour</option>
            {['1', '2', '3', '4', '5', '6'].map((hr) => (
              <option key={hr} value={hr}>
                {`${hr} hour`}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>

        <button type="submit">Fetch Students</button>
      </form>

      {loading && <p>Loading...</p>}

      {!loading && students.length > 0 && (
        <div>
          <label>
            <input
              type="checkbox"
              checked={markAllPresent}
              onChange={handleMarkAllPresentChange}
            />
            Mark All as Present
          </label>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Present</th>
                <th>Absent</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={student.attendance === 'Present'}
                      onChange={(e) => handleAttendanceChange(student._id, e.target.checked)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={student.attendance === 'Absent'}
                      onChange={(e) => handleAttendanceChange(student._id, !e.target.checked)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={submitAttendance}>Save Attendance</button>
        </div>
      )}
    </div>
  );
};

export default AttendanceForm;
