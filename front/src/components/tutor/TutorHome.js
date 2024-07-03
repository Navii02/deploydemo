import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseurl } from "../../url";
import Navbar from "./TutorNavbar";
import "./TutorHome.css"; // Import your CSS file

function TutorHome() {
  const [teachername, setTutorName] = useState('');
  const [className, setClassName] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);
  const [subjects, setSubjectsCovered] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tutorEmail = localStorage.getItem('email');
      const academicYear = localStorage.getItem('academicYear'); // Assuming academic year is stored in localStorage
      const course = localStorage.getItem('tutorclass'); // Assuming course is stored in localStorage

      if (!tutorEmail || !academicYear || !course) {
        console.error('Required data not found in localStorage');
        return;
      }

      try {
        // Fetch tutor profile details
        const response = await axios.get(`${baseurl}/api/tutor-profile?email=${tutorEmail}`);
        const { teachername, tutorclass, subjects } = response.data;

        // Fetch number of students based on academic year and course
        const studentsResponse = await axios.get(`${baseurl}/api/students-count?academicYear=${academicYear}&course=${course}`);
        const { totalStudents } = studentsResponse.data;

        setTutorName(teachername);
        setClassName(tutorclass);
        setSubjectsCovered(subjects);
        setTotalStudents(totalStudents);

        console.log('Tutor:', teachername);
        console.log('Total Students:', totalStudents);
      } catch (error) {
        console.error('Error fetching tutor profile or student count:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Log the updated state
    console.log('Tutor:', teachername);
  }, [teachername]);

  return (
    <div>
      <Navbar />
      <div className="tutor-home-container">
        <div className="welcome-section">
          <h1 className="welcome-header">Welcome, {teachername}!</h1>
          <p className="welcome-text">
            This is your tutor home page. Explore the features and modules available for you.
          </p>
          <div className="associated-data">
            <h2>Your Associated Data:</h2>
            <p><strong>Class Assigned:</strong> {className}</p>
            <p><strong>Total Students:</strong> {totalStudents}</p>
            <p><strong>Subjects Covered:</strong> {subjects.join(", ")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorHome;
