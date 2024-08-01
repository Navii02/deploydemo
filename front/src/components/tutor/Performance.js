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
      const academicYear = localStorage.getItem('academicYear');
      if (!academicYear || !tutorclass) {
        console.error('Academic year or tutor class not found in localStorage');
        return;
      }

      const response = await axios.get(`${baseurl}/api/student-performance/${tutorclass}/${academicYear}`);
      console.log('Fetched data:', response.data);

      // Check if RollNo exists in the data
      if (response.data.length > 0 && !response.data[0].hasOwnProperty('RollNo')) {
        console.error('RollNo field is missing in the fetched data');
        return;
      }

      // Sort the data based on RollNo
      const sortedData = response.data.sort((a, b) => a.RollNo.localeCompare(b.RollNo));
      console.log('Sorted data:', sortedData);

      setStudentData(sortedData);
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
                <th>Roll No</th>
                <th>Name</th>
                
                {studentData.length > 0 && studentData[0].subjects.map((subject, index) => (
                  <th key={index}>
                    <div>Subject: {subject.subject}</div>
                    <div>Internal Marks</div>
                    <div>Attendance Percentage</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentData.map((student, studentIndex) => (
                <tr key={studentIndex}>
                  <td>{student.RollNo}</td>
                  <td>{student.name}</td>
                 
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
