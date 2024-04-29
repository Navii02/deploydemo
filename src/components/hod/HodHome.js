import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './HodNavbar'; // Assuming you have a Navbar component for HOD
import './HodHome.css'; // Import your CSS file

function HodHome() {
  const [hodName, setHodName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [numFaculties, setNumFaculties] = useState(0);
  const [numStudents, setNumStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const hodEmail = localStorage.getItem('email'); // Assuming email is stored in localStorage
      console.log('HOD Email:', hodEmail);

      if (!hodEmail) {
        console.error('HOD email not found in localStorage');
        return;
      }

      try {
        const response = await axios.get(`/api/hod-profile?email=${hodEmail}`);
        console.log('Full Response:', response);

        const { hodName, departmentName, numFaculties, numStudents } = response.data;

        console.log('Received Data:', {
          hodName,
          departmentName,
          numFaculties,
          numStudents,
        });

        setHodName(hodName);
        setDepartmentName(departmentName);
        setNumFaculties(numFaculties);
        setNumStudents(numStudents);

        console.log('HOD:', hodName);
      } catch (error) {
        console.error('Error fetching HOD profile:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Log the updated state
    console.log('HOD:', hodName);
  }, [hodName]);

  return (
    <div>
      <Navbar />
      <div className="hod-home-container">
        <div className="welcome-section">
          <h1 className="welcome-header">Welcome, {hodName}!</h1>
          <p className="welcome-text">
            This is your HOD home page. Explore the features and modules available for you.
          </p>
          <div className="associated-data">
            <h2>Your Department Information:</h2>
            <p><strong>Department Name:</strong> {departmentName}</p>
            <p><strong>Number of Faculties:</strong> {numFaculties}</p>
            <p><strong>Number of Students:</strong> {numStudents}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HodHome;
