import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './HodNavbar'; // Assuming you have a Navbar component for HOD
import './HodHome.css'; // Import your CSS file
import {baseurl} from '../../url';

function HodHome() {
  const [hodName, setHodName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [teacherCounts, setTeacherCounts] = useState(0); // State to store teacher count
  const [numStudents, setNumStudents] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const hodEmail = localStorage.getItem('email'); // Assuming email is stored in localStorage
      //console.log('HOD Email:', hodEmail);

      if (!hodEmail) {
        console.error('HOD email not found in localStorage');
        return;
      }

      try {
        const response = await axios.get(`${baseurl}/api/hod-profile?email=${hodEmail}`);
        //console.log('Full Response:', response);

        const hodName = response.data.teachername; // Assuming name property in HOD profile
        const departmentName = response.data.department;
        const teacherCounts = response.data.teacherCounts; // Use the actual property name
        const studentCounts = response.data.studentCounts || 0; // Default to 0 if not provided

        /*console.log('Received Data:', {
          hodName,
          departmentName,
          teacherCounts,
          studentCounts,
        });*/

        setHodName(hodName);
        setDepartmentName(departmentName);
        setTeacherCounts(teacherCounts);
        setNumStudents(studentCounts);

        //console.log('HOD:', hodName);
      } catch (error) {
        console.error('Error fetching HOD profile:', error);
      }
    };

    fetchData();
  }, []);

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
            <p>
              <strong>Department Name:</strong> {departmentName}
            </p>
            <div>
              <p>Number of Faculties: {teacherCounts}</p>
            </div>
            <p><strong>Number of Students:</strong> {numStudents}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HodHome;
