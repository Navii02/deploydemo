import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Updates.css';
import Navbar from './TutorNavbar';

const TutorUpdates = () => {
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedDepartment = localStorage.getItem('department');
    const adjustedDepartment = adjustDepartmentName(storedDepartment);
    const storedAcademicYear = localStorage.getItem('academicYear');
    if (adjustedDepartment && storedAcademicYear) {
      fetchStudents(adjustedDepartment, storedAcademicYear);
    }
  }, []);

  const adjustDepartmentName = (department) => {
    switch (department) {
      case 'CSE':
        return 'computerScience';
      case 'ECE':
        return 'electronicsAndCommunication';
      // Add more cases as needed
      default:
        return department;
    }
  };

  const fetchStudents = async (department, academicYear) => {
    try {
      const response = await axios.get(`/api/students/tutor/${department}/${academicYear}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setErrorMessage('Error fetching students');
    }
  };

  return (
    <>
      <Navbar />
      <div className="update-container">
        <h2>Student Details</h2>
        <div className="student-list">
          {students.map((student, index) => (
            <div key={student.id} className="student-details">
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Admission Number:</strong> {student.admissionNumber}</p>
              <p><strong>Date of Birth:</strong> {student.dateOfBirth}</p>
              <p><strong>Address:</strong> {student.address}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Phone:</strong> {student.mobileNo}</p>
              <hr />
            </div>
          ))}
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
};

export default TutorUpdates;
