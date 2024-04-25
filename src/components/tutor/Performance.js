// StudentPerformancePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Performance.css';
import Navbar from './TutorNavbar';

const StudentPerformancePage = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('your_api_endpoint_here');
      setStudentData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="student-performance-container">
        <div className="table-container">
          <table className="student-performance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                {studentData.length > 0 && studentData[0].subjects.map((subject) => (
                  <th key={subject.id}>
                    <div>{subject.name}</div>
                    <div>Internal Marks</div>
                    <div>Attendance Percentage</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentData.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  {student.subjects.map((subject) => (
                    <td key={subject.id}>
                      <div>{subject.internalMarks}</div>
                      <div>{subject.attendancePercentage}%</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentPerformancePage;
