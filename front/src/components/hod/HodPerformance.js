import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

import Navbar from './HodNavbar'; // Assuming this is correctly imported

const StudentPerformancePage = () => {
  const [studentData, setStudentData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);

  const fetchCourseOptions = () => {
    const storedBranch = localStorage.getItem('branch');
    if (storedBranch === 'CS') {
      setCourseOptions(['MCA', 'B.Tech CSE', 'BCA', 'BBA']);
    } else if (storedBranch === 'EC') {
      setCourseOptions(['BTech ECE']);
    }
    // Add more branches as needed
  };

  const fetchData = useCallback(async () => {
    try {
      if (!selectedCourse) return;

      setLoading(true);
      const response = await axios.get(`/api/student-performance/${selectedCourse}`);
      let filteredStudents = response.data;

      if (selectedSemester && selectedSemester !== 'All') {
        filteredStudents = filteredStudents.filter(student => student.semester === selectedSemester);
      }

      setStudentData(filteredStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [selectedCourse, selectedSemester]);

  useEffect(() => {
    fetchCourseOptions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedCourse, selectedSemester, fetchData]);

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <div className="student-performance-container">
        <div className="selectors-container">
          <div className="course-selector">
            <label htmlFor="course">Select Course: </label>
            <select id="course" value={selectedCourse} onChange={handleCourseChange}>
              <option value="">Select a course</option>
              {courseOptions.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>
          </div>
          <div className="semester-selector">
            <label htmlFor="semester">Select Semester:</label>
            <select id="semester" value={selectedSemester} onChange={handleSemesterChange}>
              <option value="">All</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              {/* Add options for other semesters */}
            </select>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-container">
            <table className="student-performance-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Register Number</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Subjects</th>
                  <th>Internal Marks</th>
                  <th>Attendance Percentage</th>
                </tr>
              </thead>
              <tbody>
                {studentData.length > 0 ? (
                  studentData.map((student, index) => (
                    <tr key={index}>
                      <td>{student.name}</td>
                      <td>{student.RegisterNo}</td>
                      <td>{student.course}</td>
                      <td>{student.semester}</td>
                      <td>{student.internalMarks.map(subject => subject.subject).join(', ')}</td>
                      <td>{student.internalMarks.map(subject => subject.examMarks).join(', ')}</td>
                      <td>{student.internalMarks.map(subject => subject.attendance).join(', ')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">Please Select The Course</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPerformancePage;
