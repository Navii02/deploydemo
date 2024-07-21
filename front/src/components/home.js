import React, {useEffect} from 'react';
import './Home.css'; // Import the CSS file

const HomePage = () => {
  useEffect(() => {
    // Add 'homepage' class to body
    document.documentElement.classList.add('homepage');
    document.body.classList.add('homepage');

    // Cleanup by removing the class when the component unmounts
    return () => {
      document.documentElement.classList.remove('homepage');
      document.body.classList.remove('homepage');
    };
  }, []);

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

    // Reset the dropdown value to the default option after selection
    event.target.value = '';
  };

  return (
    <div className="office-home-page">
      <h1 className="animate-left">Welcome to CAP</h1>
      <h5 className="animate-right">Your Personal Assistant for College</h5>
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
