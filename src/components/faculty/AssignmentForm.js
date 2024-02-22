// AssignmentForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignmentForm.css'; // Import your CSS file
import Navbar from './FacultyNavbar';

const AssignmentForm = () => {
  const [branch, setBranch] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [assignmentDetails, setAssignmentDetails] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send assignment details to the backend
      await axios.post('/api/assignments', {
        branch,
        semester,
        subject,
        teacherName,
        assignmentDetails,
      });

      // Optionally, you can add a success message or reset the form
      setBranch('');
      setSemester('');
      setSubject('');
      setTeacherName('');
      setAssignmentDetails('');
    } catch (error) {
      console.error('Error submitting assignment details:', error);
      // Handle error, show an error message, etc.
    }
  };

  return (
    <div>
    <Navbar/>
    <div className="assignment-form-container">
      <form onSubmit={handleSubmit}>
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
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>

        <label>
          Teacher Name:
          <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} />
        </label>

        <label>
          Assignment Details:
          <textarea value={assignmentDetails} onChange={(e) => setAssignmentDetails(e.target.value)} />
        </label>

        <button type="submit">Send</button>
      </form>
    </div>
    </div>
  );
};

export default AssignmentForm;
