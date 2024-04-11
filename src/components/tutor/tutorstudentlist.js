import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDetailsPage() {
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  useEffect(() => {
    // Retrieve department and academic year from local storage
    const storedDepartment = localStorage.getItem('department');
    const storedAcademicYear = localStorage.getItem('academicYear');
    
    if (storedDepartment && storedAcademicYear) {
      setDepartment(storedDepartment);
      setAcademicYear(storedAcademicYear);
    }
  }, []);

  useEffect(() => {
    if (department && academicYear) {
      fetchStudents();
    }
  }, [department, academicYear ]); // Include department and academicYear in the dependency array

  const fetchStudents = async () => {
    try {
      // Adjust department names before sending the request
      const adjustedDepartment = adjustDepartmentName(department);
      
      const response = await axios.get(`/api/tutor?department=${adjustedDepartment}&academicYear=${academicYear}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Function to adjust department names
  const adjustDepartmentName = (dept) => {
    if (dept === 'CSE') {
      return 'computerScience';
    } else if (dept === 'ECE') {
      return 'electronicsAndCommunication';
    } else {
      return dept;
    }
  };

  return (
    <div>
      <h1>Student Details</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Admission Number</th>
            <th>Department</th>
            <th>Academic Year</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.admissionNumber}</td>
              <td>{student.course}</td>
              <td>{student.academicYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentDetailsPage;
