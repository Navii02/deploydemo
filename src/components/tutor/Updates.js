// TutorUpdates.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Updates.css'; // Import your CSS file
import Navbar from './TutorNavbar';

const TutorUpdates = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch students from the database based on the tutor's class
  useEffect(() => {
    fetchStudents(); // Fetch students when component mounts
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students'); // Replace with actual API endpoint
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleCheckboxChange = (email) => {
    const isChecked = selectedStudents.includes(email);
    setSelectedStudents((prevSelected) =>
      isChecked ? prevSelected.filter((selected) => selected !== email) : [...prevSelected, email]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(students.map((student) => student.email));
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post('/api/sendMessage', {
        selectedStudents,
        message,
      });
      setSuccessMessage(response.data.message);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Error sending message.');
      setSuccessMessage('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="tutor-updates-container">
        <div className="form-container">
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <div className="checkbox-container">
            <label>
              <input type="checkbox" onChange={handleSelectAll} />
              Select All
            </label>
            {students.map((student) => (
              <div key={student.id}>
                <input
                  type="checkbox"
                  id={student.email}
                  onChange={() => handleCheckboxChange(student.email)}
                  checked={selectedStudents.includes(student.email)}
                />
                <label htmlFor={student.email}>{student.name}</label>
              </div>
            ))}
          </div>
          <button onClick={handleSendMessage}>Send Message</button>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
      </div>
    </>
  );
};

export default TutorUpdates;
