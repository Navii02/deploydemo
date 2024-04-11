import React, { useState, useEffect } from 'react';

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
      <h1>Student Details</h1>
      <h2>Branch: {branch}</h2>
      <div>
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
        <h3>Students:</h3>
        <ul>
          {filteredStudents.map((student) => (
            <li key={student._id}>
              <div>
                <strong>Name:</strong> {student.name}
              </div>
              <div>
                <strong>Semester:</strong> {student.semester}
              </div>
              <div>
                <strong>Register Number:</strong> {student.admissionNumber}
              </div>
              <div>
                <strong>Email:</strong> {student.email}
              </div>
              {/* Add other details as needed */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
