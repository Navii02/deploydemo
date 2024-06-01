import React, { useEffect, useState, useCallback } from 'react';
import '../../App.css';
import Navbar from './UserNavbar';
import './Dashboard.css';

function Dashboard() {
  const [student, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userEmail = localStorage.getItem('email'); // Get the user's email from localStorage

  const fetchStudentDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/student/${userEmail}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudentDetails(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchStudentDetails();

    const intervalId = setInterval(fetchStudentDetails, 300000); // Fetch data every 5 minutes (300000 milliseconds)

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [fetchStudentDetails]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <p className="loading-text">Loading...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <p className="error-text">Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        {student ? (
          <div className="student-details">
            <div className="student-info">
              <div className="student-image">
                {student.photo && <img src={student.photo} alt="Student" className="student-photo" />}
              </div>
              <div className="student-text">
                <h4>Name: {student.name}</h4>
                <p>Email: {student.email}</p>
                <p>Register Number: {student.admissionNumber}</p>
                <p>Date of Birth: {formatDate(student.dateOfBirth)}</p>
                <p>Branch: {student.course}</p>
                <p>Semester: {student.semester}</p>
                <p>Address: {student.address}</p>
                <p>Gender: {student.gender}</p>
                <p>Religion: {student.religion}</p>
                <p>Caste: {student.community}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="loading-text">No student data available.</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;
