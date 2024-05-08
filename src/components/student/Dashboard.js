import React, { useEffect, useState } from 'react';
import '../../App.css';
import Navbar from './UserNavbar';
import './Dashboard.css';

function Dashboard() {
  const [student, setStudentDetails] = useState(null);
  const userEmail = localStorage.getItem('email'); // Get the user's email from localStorage

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

  useEffect(() => {
    fetchStudentDetails();

    const intervalId = setInterval(fetchStudentDetails, 300000); // Fetch data every 5 minutes (300000 milliseconds)

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
                <p>Plus Two Board: {student.plusTwo?.board}</p>
                <p>Plus Two Mark Percentage: {student.plusTwo?.percentage}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="loading-text">Loading...</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;
