import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './HodNavbar'; // Assuming you have a Navbar component for HOD

const HodPerformancePage = () => {
  const [studentData, setStudentData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');

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

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className="student-performance-container">
        <div className="semester-selection">
          <label htmlFor="semester">Select Semester:</label>
          <select id="semester" value={selectedSemester} onChange={handleSemesterChange}>
            <option value="">All</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
          </select>
        </div>
        <div className="table-container">
          <table className="student-performance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                {Array.isArray(studentData) && studentData.length > 0 && studentData[0].subjects && studentData[0].subjects.map((subject) => (
                  <th key={subject.id}>
                    <div>{subject.name}</div>
                    <div>Internal Marks</div>
                    <div>Attendance Percentage</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(studentData) && studentData.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.rollNumber}</td>
                  {Array.isArray(student.subjects) && student.subjects.map((subject) => (
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

export default HodPerformancePage;
