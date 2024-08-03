import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './FacultyNavbar';
import './AttendanceForm.css';

const AttendanceSummary = () => {
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewMode, setViewMode] = useState('regular'); // New state to toggle view mode

  useEffect(() => {
    const fetchBranchesAndSemesters = async () => {
      const email = localStorage.getItem('email');

      try {
        const response = await axios.post(`/api/data/attendance`, { email });
        const { subjects, semesters, branches } = response.data;
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
    if (!course || !semester || !subject || (viewMode === 'monthly' && (!startDate || !endDate))) {
      console.error('Please select course, semester, subject, and date range');
      return;
    }

    try {
      const endpoint = viewMode === 'monthly' ? '/api/attendance/summary/monthly' : '/api/attendance/summary';
      const response = await axios.post(`${endpoint}`, { course, semester, subject, startDate, endDate });
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

  const printMonthlyAttendance = () => {
    if (viewMode !== 'monthly') {
      console.error('Print functionality is only available in monthly view');
      return;
    }

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.open();
    
    // Create the HTML content with start and end dates
    let htmlContent = `
      <html>
        <head>
          <title>Monthly Attendance Summary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            h1 {
              text-align: center;
            }
            .date-range {
              margin-bottom: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h1>Monthly Attendance Summary</h1>
          <div class="date-range">
            <p><strong>Date Range:</strong> ${formatDate(startDate)} to ${formatDate(endDate)}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>No. of Present</th>
                <th>No. of Absent</th>
                <th>Total Attendance</th>
                <th>Percentage</th>
                <th>Absent Details</th>
              </tr>
            </thead>
            <tbody>
    `;

    attendanceData.forEach((data, index) => {
      htmlContent += `
        <tr>
          <td>${students[index].name}</td>
          <td>${data.attendance.present}</td>
          <td>${data.attendance.absent}</td>
          <td>${data.attendance.total}</td>
          <td>${data.attendance.percentage}%</td>
          <td>
      `;
      data.attendance.absentDetails.forEach((absent, idx) => {
        htmlContent += `Date: ${formatDate(absent.date)}, Hour: ${absent.hour}<br>`;
      });
      htmlContent += `</td></tr>`;
    });

    htmlContent += `
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div>
      <Navbar />
      <div className="attendance-form">
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

          {viewMode === 'monthly' && (
            <>
              <label>
                Start Date:
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </label>
              <label>
                End Date:
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </label>
            </>
          )}

          <div>
            <label>
              <input
                type="radio"
                value="regular"
                checked={viewMode === 'regular'}
                onChange={() => setViewMode('regular')}
              />
              Regular Summary
            </label>
            <label>
              <input
                type="radio"
                value="monthly"
                checked={viewMode === 'monthly'}
                onChange={() => setViewMode('monthly')}
              />
              Monthly Summary
            </label>
          </div>

          <button type="submit">Fetch Attendance Summary</button>
        </form>

        {attendanceData.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>No. of Present</th>
                <th>No. of Absent</th>
                <th>Total Attendance</th>
                <th>Percentage</th>
                <th>Absent Details</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((data, index) => (
                <tr key={students[index]._id}>
                  <td>{students[index].name}</td>
                  <td>{data.attendance.present}</td>
                  <td>{data.attendance.absent}</td>
                  <td>{data.attendance.total}</td>
                  <td>{data.attendance.percentage}%</td>
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
        
        {viewMode === 'monthly' && attendanceData.length > 0 && (
          <button type="button" onClick={printMonthlyAttendance}>Print Monthly Attendance</button>
        )}
      </div>
    </div>
  );
};

export default AttendanceSummary;
