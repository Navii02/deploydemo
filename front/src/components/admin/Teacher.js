import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './AdminNavbar';
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
          axios.get(`/api/faculty`),
          axios.get(`/api/admin/tutors`),
          axios.get(`/api/hods`)
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

  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`/api/${type}/${id}`);
      // Update the state to remove the deleted item
      switch (type) {
        case 'faculty':
          setFacultyData(facultyData.filter(item => item._id !== id));
          break;
        case 'tutor':
          setTutorData(tutorData.filter(item => item._id !== id));
          break;
        case 'hod':
          setHodData(hodData.filter(item => item._id !== id));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error deleting data', error);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return 'No date';
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.error('Invalid date:', date);
      return 'Invalid date';
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'faculty':
        return (
          <div>
            <h2>Faculty Details</h2>
            <ul>
              {facultyData.map(faculty => (
                <li key={faculty._id}>
                        <div>
                <p>Name: {faculty.name}</p> 
                 <p>Email:{faculty.email} </p> 
                  <p>Role:{faculty.role} </p>  
                  <p>Created Date:{formatDate(faculty.date)}</p> 
                  <button onClick={() => handleDelete(faculty._id, 'faculty')}>Delete</button>
                  </div>
                </li>
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
                <li key={tutor._id}>
                  <div>
                <p>Name: {tutor.name}</p> 
                 <p>Email:{tutor.email} </p> 
                  <p>Role:{tutor.role} </p>  
                  <p>Created Date:{formatDate(tutor.date)}</p> 
                  <button onClick={() => handleDelete(tutor._id, 'tutor')}>Delete</button>
                  </div>
                </li>
                
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
                <li key={hod._id}>
                      <div>
                <p>Name: {hod.name}</p> 
                 <p>Email:{hod.email} </p> 
                  <p>Role:{hod.role} </p>  
                  <p>Created Date:{formatDate(hod.date)}</p> 
                  <button onClick={() => handleDelete(hod._id, 'hod')}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div>
      <Navbar/>
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
    </div>
  );
};

export default AdminPage;
