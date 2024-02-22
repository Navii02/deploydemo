import React from 'react';
import './Home.css'; // Import the CSS file

const HomePage = () => {
  const handleSelection = (event) => {
    const selectedUser = event.target.value;
    switch (selectedUser) {
      case 'student':
        window.location.href = '/studentlogin'; // Redirect to student login page
        break;
      case 'officer':
        window.location.href = '/officerlogin'; // Redirect to officer login page
        break;
      case 'faculty':
        window.location.href = '/faculitylogin'; // Redirect to faculty login page
        break;
      case 'classTutor':
        window.location.href = '/classtutorlogin'; // Redirect to class tutor login page
        break;
      case 'hod':
        window.location.href = '/hodlogin'; // Redirect to HOD login page
        break;
      case 'principal':
        window.location.href = '/principallogin'; // Redirect to principal login page
        break;
      case 'admin':
        window.location.href = '/adminlogin'; // Redirect to admin login page
        break;
      default:
        break;
    }
  };

  return (
    <div className="office-home-page">
      <h1>Welcome to the Office</h1>
      <h6>Who are You?</h6>
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
