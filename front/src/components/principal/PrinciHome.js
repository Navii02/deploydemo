import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './PrinciNavbar'; // Assuming you have a Navbar component for the Principal
import './PrinciHome.css'; // Import your CSS file


function PrincipalHome() {
  
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalOfficers, setTotalOfficers] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
   const princpalname=localStorage.getItem('name');
  useEffect(() => {
    const fetchPrincipalData = async () => {
      try {
   
        // Fetch total number of students
        const responseStudents = await axios.get(`/api/total-students`);
        setTotalStudents(responseStudents.data.totalStudents);

        // Fetch total number of officers
        const responseOfficers = await axios.get(`/api/total-officers`);
        setTotalOfficers(responseOfficers.data.totalOfficers);

        // Fetch total number of teachers
        const responseTeachers = await axios.get(`/api/total-teachers`);
        setTotalTeachers(responseTeachers.data.totalTeachers);
      } catch (error) {
        console.error('Error fetching principal data:', error);
      }
    };

    fetchPrincipalData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="principal-home-container">
        <div className="welcome-section">
          <h1 className="welcome-header">Welcome, { princpalname}!</h1>
          <p className="welcome-text">
            This is your Principal home page. Review the key metrics and data about your institution.
          </p>
          <div className="associated-data">
            <h2>Institution Information:</h2>
            <p><strong>Total Students:</strong> {totalStudents}</p>
            <p><strong>Total Officers:</strong> {totalOfficers}</p>
            <p><strong>Total Teachers:</strong> {totalTeachers}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrincipalHome;
