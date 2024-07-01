import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './FacultyNavbar';

const AttendanceSummary = () => {
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchBranchesAndSemesters = async () => {
      const email = localStorage.getItem('email');

      try {
        const response = await axios.post('/api/data/attendance', { email });
        const { subjects, semesters, branches} = response.data;
        setCourses(branches || []);
        setSemesters(semesters || []);
        setSubjects(subjects || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchBranchesAndSemesters();
  }, []);

  const fetchAttendance = async () => {
    if (!course || !semester || !subject) {
      console.error('Please select branch, semester, and subject');
      return;
    }

    try {
      const response = await axios.post('/api/attendance/summary', { course, semester, subject });
      setStudents(response.data.students || []);
      setAttendanceData(response.data.attendance || []);
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    }
  };
 // Function to format date to dd/mm/yyyy
 const formatDate = (dateString) => {
  const dateObj = new Date(dateString);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1; // Months are zero-indexed
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};
  return (
    <div>
      <Navbar />
      <form onSubmit={(e) => { e.preventDefault(); fetchAttendance(); }}>
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

        <button type="submit">Fetch Attendance Summary</button>
      </form>

      {attendanceData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
            <th>No.of Present</th>
            <th>No.of Absent</th>

              <th>Total Attendance</th>
              <th></th>
              <th>Percentage</th>
              <th>Absent Details</th> {/* New column for absent details */}
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((data, index) => (
              <tr key={students[index]._id}>
                <td>{students[index].name}</td>
                <td>
                   {data.attendance.present} 
                </td>
                <td>
               {data.attendance.absent}
                </td>
                <td>
             {data.attendance.total}
                </td>
                <td>
                  {data.attendance.present}/{data.attendance.total}
                </td>
                <td>
                  {data.attendance.percentage}%
                </td>
                <td>
                  {data.attendance.absentDetails.map((absent, idx) => (
                    <div key={idx}>
                       Date: {formatDate(absent.date)}, Hour: {absent.hour}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceSummary;
