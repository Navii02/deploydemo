import React, { useState, useEffect } from 'react';
import HodNavbar from './HodNavbar';

function StudentDetailsPage() {
  const [branch, setBranch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    // Fetch branch from localStorage
    const storedBranch = localStorage.getItem('branch');
    if (storedBranch) {
      // Map branch names
      const mappedBranch = mapBranchName(storedBranch);
      setBranch(mappedBranch);

      // Fetch student details based on mapped branch
      fetchStudents(mappedBranch);
    }
  }, []);

  const mapBranchName = (branch) => {
    switch (branch) {
      case 'CSE':
        return 'computerScience';
      case 'ECE':
        return 'electronicsAndCommunication';
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
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSemesterChange = (event) => {
    setSelectedSemester(event.target.value);
  };

  useEffect(() => {
    // Filter students based on selected semester
    if (selectedSemester) {
      const filteredStudents = students.filter(student => String(student.semester) === selectedSemester);
      setFilteredStudents(filteredStudents);
    } else {
      setFilteredStudents(students);
    }
  }, [students, selectedSemester]);

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
          <option value="5">Semester 5</option>
          <option value="6">Semester 6</option>
          <option value="7">Semester 7</option>
          <option value="8">Semester 8</option>
          {/* Add more options for other semesters */}
        </select>
      </div>
      <div>
        &nbsp;
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Semester</th>
              <th>Register Number</th>
              <th>Email</th>
              {/* Add other table headers as needed */}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.semester}</td>
                <td>{student.admissionNumber}</td>
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
