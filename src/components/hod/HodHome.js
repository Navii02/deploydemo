import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './HodNavbar'; // Assuming you have a Navbar component for HOD
import './HodHome.css'; // Import your CSS file

function HodHome() {
  const [hodName, setHodName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const [teacherCounts, setTeacherCounts] = useState({}); // Object to store course ID and count
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

        const hodName = response.data.teachername; // Assuming name property in HOD profile
        const departmentName = response.data.couse;
        const teacherCounts = response.data.teacherCounts; // Use the actual property name
        const studentCounts = response.data.studentCounts;
        console.log('Received Data:', {
          hodName,
          departmentName,
          teacherCounts,
        });

        setHodName(hodName);
        setDepartmentName(departmentName);
        setTeacherCounts(teacherCounts);
          setNumStudents(studentCounts);

        console.log('HOD:', hodName);
      } catch (error) {
        console.error('Error fetching HOD profile:', error);
      }
    };

    fetchData();
  }, []);

  const totalFaculties = Object.values(teacherCounts).reduce((acc, count) => acc + count, 0);

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
            {/* Details of faculties per course (optional) */}
            {Object.keys(teacherCounts).length > 0 && (
              <div>
                <p>Number of Faculties : {totalFaculties}</p>
               
                
              </div>
            )}
            <p><strong>Number of Students:</strong> {numStudents}(Data not available yet)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HodHome;
