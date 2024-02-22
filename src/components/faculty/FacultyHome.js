// FacultyHome.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./FacultyNavbar";
import "./FacultyHome.css"; // Import your CSS file

function FacultyHome() {
  const [teachername, setTeacherName] = useState('');
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = localStorage.getItem('email');
      console.log('User Email:', userEmail);

      if (!userEmail) {
        console.error('User email not found in localStorage');
        return;
      }

      try {
        const response = await axios.get(`/api/teacher-profile?email=${userEmail}`);
        console.log('Full Response:', response);

        const { teachername, branches, semesters, subjects } = response.data;

        console.log('Received Data:', {
          teachername,
          branches,
          semesters,
          subjects,
        });

        setTeacherName(teachername);
        setBranches(branches);
        setSemesters(semesters);
        setSubjects(subjects);

        console.log('User:', teachername);
      } catch (error) {
        console.error('Error fetching teacher profile:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Log the updated state
    console.log('User:', teachername);
  }, [teachername]);

  return (
    <div>
      <Navbar/>
      <div className="faculty-home-container">
        <div className="welcome-section">
          <h1 className="welcome-header">Welcome, {teachername}!</h1>
          <p className="welcome-text">
            This is your faculty home page. Explore the features and modules available for you.
          </p>
          <div className="associated-data">
            <h2>Your Associated Data:</h2>
            <p><strong>Branches:</strong> {branches.join(", ")}</p>
            <p><strong>Semesters:</strong> {semesters.join(", ")}</p>
            <p><strong>Subjects:</strong> {subjects.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FacultyHome;
