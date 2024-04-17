import React, { useEffect, useState } from 'react';
import './Home.css'; // Import the CSS file

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false); // State to manage text visibility

  useEffect(() => {
    // Set timeout to delay visibility toggle
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 0.5); // Adjust the delay as needed

    return () => clearTimeout(timeout); // Cleanup function
  }, []); // Run effect only once on component mount

  const handleSelection = (event) => {
    const selectedUser = event.target.value;
    switch (selectedUser) {
      case 'student':
        window.location.href = '/studentlogin';
        break;
      case 'officer':
        window.location.href = '/officerlogin';
        break;
      case 'faculty':
        window.location.href = '/facultylogin'; // Corrected typo
        break;
      case 'classTutor':
        window.location.href = '/classtutorlogin';
        break;
      case 'hod':
        window.location.href = '/hodlogin';
        break;
      case 'principal':
        window.location.href = '/principallogin';
        break;
      case 'admin':
        window.location.href = '/adminlogin';
        break;
      default:
        break;
    }
  };

  return (
    <div className="office-home-page">
      <h1 className="animate-left">Welcome to CAP</h1>
      <h5 className="animate-right">Your Personal Assistant for College</h5>
      <h6 className={isVisible ? 'animate-fade-in' : 'animate-fade-out'}>Who are You?</h6>
      <div className="dropdown-container">
        <select onChange={handleSelection}>
          <option value="">Select User Type</option>
          <option value="student">Student</option>
          <option value="officer">Officer</option>
          <option value="faculty">Faculty</option>
          <option value="classTutor">Class Tutor</option>
          <option value="hod">HOD</option>
          <option value="principal">Principal</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
};

export default HomePage;
