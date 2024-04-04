import React, { useEffect, useState } from 'react';
import '../../App.css';
import Navbar from './UserNavbar';
import './Dashboard.css';

function Dashboard() {
  const [student, setStudentDetails] = useState(null);
  const userEmail = localStorage.getItem('email'); // Get the user's email from localStorage
  console.log('User Email:', userEmail);

  useEffect(() => {
    fetchStudentDetails();
  },);

  const fetchStudentDetails = () => {
    fetch(`/api/student/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setStudentDetails(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
    <Navbar />
    <div className="dashboard-container">
      <h1 className="dashboard-title">Student Details</h1>
      {student ? (
        <div className="student-details">
          <h4>Name: {student.name}</h4>
          <p>Email: {student.email}</p>
          <p>Register Number: {student.admissionNumber}</p>
          <p>Date of Birth: {student.dateOfBirth}</p>
          <p>Branch: {student.course}</p> 
          <p>Semester: {student.semester}</p>
          <p>Address: {student.address}</p>
          <p>Gender: {student.gender}</p>
          <p>Religion: {student.religion}</p>
          <p>Caste: {student.community}</p>
          <p>Plus Two Board: {student.plusTwo.board}</p>
          <p>Plus Two Mark Percentage: {student.plusTwo.percentage}</p>
          
          <br/>
          
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
    </>
  );
}

export default Dashboard;

