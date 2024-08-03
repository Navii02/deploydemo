import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Import the CSS file
import axios from 'axios';
import { baseurl } from '../url';

const HomePage = () => {
  const navigate = useNavigate();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    // Add 'homepage' class to body
    document.documentElement.classList.add('homepage');
    document.body.classList.add('homepage');

    const checkApprovalStatus = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/status`);
        setIsApproved(response.data.isApproved);
      } catch (error) {
        console.error('Error fetching approval status:', error);
      }
    };

    checkApprovalStatus();

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
        navigate('/studentlogin');
        break;
      case 'officer':
        navigate('/officerlogin');
        break;
      case 'faculty':
        navigate('/facultylogin');
        break;
      case 'classTutor':
        navigate('/classtutorlogin');
        break;
      case 'hod':
        navigate('/hodlogin');
        break;
      case 'principal':
        navigate('/principallogin');
        break;
      case 'admin':
        navigate('/adminlogin');
        break;
      default:
        break;
    }

    // Reset the dropdown value to the default option after selection
    event.target.value = '';
  };

  const handleAdmission = () => {
    navigate('/admission'); // Redirect to the admissions page
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
      {isApproved && (
        <button className="admission-button" onClick={handleAdmission}>
          Application Form
        </button>
      )}
    </div>
  );
};

export default HomePage;
