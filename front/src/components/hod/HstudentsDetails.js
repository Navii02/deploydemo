import React, { useState, useEffect } from 'react';
import HodNavbar from './HodNavbar';
import './HstudentDetail.css';



function StudentDetailsPage() {
  const [branch, setBranch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    const fetchStudents = async (branch) => {
      try {
        const response = await fetch(`/api/students/${branch}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudents(data.students);

        const uniqueCourses = [...new Set(data.students.map(student => student.course))];
        setCourseOptions(['All', ...uniqueCourses]);
      } catch (error) {
        console.error(error.message);
      }
    };

    const storedBranch = localStorage.getItem('branch');
    if (storedBranch) {
      setBranch(storedBranch);
      fetchStudents(storedBranch);
    }
  }, []); // No dependencies

  useEffect(() => {
    let newFilteredStudents = [...students];
    if (selectedSemester !== '' && selectedSemester !== 'All') {
      newFilteredStudents = newFilteredStudents.filter((student) => String(student.semester) === selectedSemester);
    }
    if (selectedCourse && selectedCourse !== 'All') {
      newFilteredStudents = newFilteredStudents.filter((student) => student.course.includes(selectedCourse));
    }
    setFilteredStudents(newFilteredStudents);
  }, [students, selectedSemester, selectedCourse]);

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <div>
      <HodNavbar />
      <div className="student-details-container">
        <h3 className="student-details-title">Branch: {branch}</h3>
        <div className="student-details-label-select">
          <label htmlFor="semester">Select Semester:</label>
          <select id="semester" value={selectedSemester} onChange={handleSemesterChange}>
            <option value="">All</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            {/* Add options for other semesters */}
          </select>
        </div>
        <div className="student-details-label-select">
          <label htmlFor="course">Select Course:</label>
          <select id="course" value={selectedCourse} onChange={handleCourseChange}>
            {courseOptions.map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </select>
        </div>
        <div className="student-details-table-container">
          <table className="student-details-table">
            <thead>
              <tr>
                <th>Register Number</th>
                <th>Name</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Email</th>
                {/* Add other table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.admissionNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>{student.semester}</td>
                  <td>{student.email}</td>
                  {/* Add other table cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
