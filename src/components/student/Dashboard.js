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
          <p>Register Number: {student.registerNumber}</p>
          <p>Date of Birth: {student.dateOfBirth}</p>
          <p>Branch: {student.branch}</p> 
          <p>Semester: {student.semester}</p>
          <p>Address: {student.address}</p>
          <p>Gender: {student.gender}</p>
          <p>Religion: {student.religion}</p>
          <p>Caste: {student.caste}</p>
          <p>Category: {student.category}</p>
          <p>Plus Two Mark Percentage: {student.plusTwoPercentage}</p>
          <p>Tenth Mark Percentage: {student.tenthPercentage}</p>
          <br/>
          <h2>Fee Payment Status</h2>
          <p>First Year: {student.firstYearFees}</p>
          <p>Second Year: {student.secondYearFees}</p>
          <p>Third Year: {student.thirdYearFees}</p>
          <p>Fourth Year: {student.fourthYearFees}</p>
        </div>
      ) : (
        <p className="loading-text">Loading...</p>
      )}
    </div>
    </>
  );
}

export default Dashboard;

