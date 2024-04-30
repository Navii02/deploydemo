// InternalMarksForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InternalMarksForm.css'; // Import the CSS file
import Navbar from './FacultyNavbar';


const InternalMarksForm = () => {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [studentsData, setStudentsData] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // Fetch subjects based on branch and semester
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`/api/subjects?branch=${branch}&semester=${semester}`);
        setSubjects(response.data.subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    if (branch && semester) {
      fetchSubjects();
    }
  }, [branch, semester]);

  // Fetch students based on branch, semester, and subject
  useEffect(() => {
    const fetchStudentsData = async () => {
      try {
        const response = await axios.get(`/api/students?branch=${branch}&semester=${semester}&subject=${subject}`);
        setStudentsData(response.data.studentsData);
      } catch (error) {
        console.error('Error fetching students data:', error);
      }
    };

    if (branch && semester && subject) {
      fetchStudentsData();
    }
  }, [branch, semester, subject]);

  const handleEdit = (index) => {
    console.log(`Editing marks for student: ${studentsData[index].name}`);
  };

  const handleSave = async (index) => {
    console.log(`Saving marks for student: ${studentsData[index].name}`);
    // You can send the updated marks to the backend here
  };

  return (
    <div>
      <Navbar/>
      <div className="internal-container">
      <div className="selections">
        <label>
          Branch:
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            {/* Add other branches as needed */}
          </select>
        </label>

        <label>
          Semester:
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="s1">S1</option>
            <option value="s2">S2</option>
            <option value="s3">S3</option>
            <option value="s4">S4</option>
            <option value="s5">S5</option>
            <option value="s6">S6</option>
            <option value="s7">S7</option>
            <option value="s8">S8</option>
          </select>
        </label>

        <label>
          Subject:
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </label>
      </div>

      <table className="marks-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Assignment 1</th>
            <th>Assignment 2</th>
            <th>Exam 1</th>
            <th>Exam 2</th>
            <th>Attendance</th>
            <th>Aggregate</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {studentsData.map((student, index) => (
            <tr key={index}>
              <td>{student.name}</td>
              <td contentEditable="true">{student.assignment1}</td>
              <td contentEditable="true">{student.assignment2}</td>
              <td contentEditable="true">{student.exam1}</td>
              <td contentEditable="true">{student.exam2}</td>
              <td contentEditable="true">{student.attendance}</td>
              <td>{student.aggregate}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleSave(index)}>Save</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default InternalMarksForm;
