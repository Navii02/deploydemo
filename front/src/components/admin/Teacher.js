// AdminPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseurl} from '../../url';
import './teacher.css'; // Import your CSS file for styling

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState('faculty');
  const [facultyData, setFacultyData] = useState([]);
  const [tutorData, setTutorData] = useState([]);
  const [hodData, setHodData] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const [facultyResponse, tutorResponse, hodResponse] = await Promise.all([
          axios.get(`${baseurl}/api/faculty`),
          axios.get(`${baseurl}/api/tutors`),
          axios.get(`${baseurl}/api/hods`)
        ]);

        setFacultyData(facultyResponse.data);
        setTutorData(tutorResponse.data);
        setHodData(hodResponse.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'faculty':
        return (
          <div>
            <h2>Faculty Details</h2>
            <ul>
              {facultyData.map(faculty => (
                <li key={faculty.id}>{faculty.name} - {faculty.role}</li>
              ))}
            </ul>
          </div>
        );
      case 'tutor':
        return (
          <div>
            <h2>Tutor Details</h2>
            <ul>
              {tutorData.map(tutor => (
                <li key={tutor.id}>{tutor.name} - {tutor.role}</li>
              ))}
            </ul>
          </div>
        );
      case 'hod':
        return (
          <div>
            <h2>HOD Details</h2>
            <ul>
              {hodData.map(hod => (
                <li key={hod.id}>{hod.name} - {hod.role}</li>
              ))}
            </ul>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="admin-page">
      <nav className="tabs">
        <button onClick={() => setActiveSection('faculty')}>Faculty</button>
        <button onClick={() => setActiveSection('tutor')}>Tutor</button>
        <button onClick={() => setActiveSection('hod')}>HOD</button>
      </nav>
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminPage;
