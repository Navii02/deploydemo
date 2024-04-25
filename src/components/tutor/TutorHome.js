import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./TutorNavbar";
import "./TutorHome.css"; // Import your CSS file

function TutorHome() {
  const [tutorName, setTutorName] = useState('');
  const [className, setClassName] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);
  const [subjectsCovered, setSubjectsCovered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tutorEmail = localStorage.getItem('email');
      console.log('Tutor Email:', tutorEmail);

      if (!tutorEmail) {
        console.error('Tutor email not found in localStorage');
        return;
      }

      try {
        const response = await axios.get(`/api/tutor-profile?email=${tutorEmail}`);
        console.log('Full Response:', response);

        const { tutorName, className, totalStudents, subjectsCovered } = response.data;

        console.log('Received Data:', {
          tutorName,
          className,
          totalStudents,
          subjectsCovered,
        });

        setTutorName(tutorName);
        setClassName(className);
        setTotalStudents(totalStudents);
        setSubjectsCovered(subjectsCovered);

        console.log('Tutor:', tutorName);
      } catch (error) {
        console.error('Error fetching tutor profile:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Log the updated state
    console.log('Tutor:', tutorName);
  }, [tutorName]);

  return (
    <div>
      <Navbar/>
      <div className="tutor-home-container">
        <div className="welcome-section">
          <h1 className="welcome-header">Welcome, {tutorName}!</h1>
          <p className="welcome-text">
            This is your tutor home page. Explore the features and modules available for you.
          </p>
          <div className="associated-data">
            <h2>Your Associated Data:</h2>
            <p><strong>Class Assigned:</strong> {className}</p>
            <p><strong>Total Students:</strong> {totalStudents}</p>
            <p><strong>Subjects Covered:</strong> {subjectsCovered.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorHome;
