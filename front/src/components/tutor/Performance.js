// StudentPerformancePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseurl } from '../../url';
import './Performance.css';
import Navbar from './TutorNavbar';

const StudentPerformancePage = () => {
  const [studentData, setStudentData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tutorclass = localStorage.getItem('tutorclass');
      console.log(tutorclass);
      const academicYear = localStorage.getItem('academicYear');
      if (!academicYear&&!tutorclass) {
        console.error('Academic year not found in localStorage');
        return;
      }

      const response = await axios.get(`${baseurl}/api/student-performance/${tutorclass}/${academicYear}`);
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
                {studentData.length > 0 && studentData[0].subjects.map((subject, index) => (
                  <th key={index}>
                    <div>{subject.subject}</div>
                    <div>Internal Marks</div>
                    <div>Attendance Percentage</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentData.map((student, studentIndex) => (
                <tr key={studentIndex}>
                  <td>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  {student.subjects.map((subject, subjectIndex) => (
                    <td key={subjectIndex}>
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
