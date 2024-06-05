import React, { useState, useEffect } from 'react';
import HodNavbar from './HodNavbar';

function StudentDetailsPage() {
  const [branch, setBranch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    const storedBranch = localStorage.getItem('branch');
    if (storedBranch) {
      const mappedBranch = mapBranchName(storedBranch);
      setBranch(mappedBranch);
      fetchStudents(mappedBranch);
    }
  }, []);

  const mapBranchName = (branch) => {
    switch (branch) {
      case 'CSE':
        return 'CSE';
      case 'ECE':
        return 'ECE';
      default:
        return branch;
    }
  };

  const fetchStudents = async (branch) => {
    try {
      const response = await fetch(`/api/students/${branch}`);
      if (!response.ok) {
        throw new Error('Failed to fetch student details');
      }
      const data = await response.json();
      setStudents(data.students);

      const uniqueCourses = [...new Set(data.students.flatMap(student => student.course))];
      setCourses(uniqueCourses);
    } catch (error) {
      console.error(error.message);
    }
  };

  const setCourses = (courses) => {
    setCourseOptions(['All', ...courses]);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  useEffect(() => {
    let filteredStudents = students;
    if (selectedSemester !== '' && selectedSemester !== 'All') {
      filteredStudents = filteredStudents.filter((student) => String(student.semester) === selectedSemester);
    }
    if (selectedCourse && selectedCourse !== 'All') {
      filteredStudents = filteredStudents.filter((student) => student.course.includes(selectedCourse));
    }
    setFilteredStudents(filteredStudents);
  }, [students, selectedSemester, selectedCourse]);

  return (
    <div>
      <HodNavbar />
      <h3>Branch: {branch}</h3>
      <div>
        &nbsp;
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
      <div>
        &nbsp;
        <label htmlFor="course">Select Course:</label>
        <select id="course" value={selectedCourse} onChange={handleCourseChange}>
          {courseOptions.map((course, index) => (
            <option key={index} value={course}>{course}</option>
          ))}
        </select>
      </div>
      <div>
        &nbsp;
        <table>
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
  );
}

export default StudentDetailsPage;
