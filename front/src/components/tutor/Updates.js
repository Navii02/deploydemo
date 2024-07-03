import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseurl } from '../../url';
import './Updates.css';
import Navbar from './TutorNavbar';

const TutorUpdates = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

 
    useEffect(() => {
      const tutorclass = localStorage.getItem('tutorclass');
      
      const academicYear = localStorage.getItem('academicYear');
      if (tutorclass && academicYear) {
        fetchStudents(tutorclass, academicYear);
      }
      console.log(tutorclass, academicYear);
    }, []);
  
  


  const fetchStudents = async (tutorclass, academicYear) => {
    try {
      const response = await axios.get(`${baseurl}/api/students/${tutorclass}/${academicYear}`);
      setStudents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setErrorMessage('Error fetching students');
    }
  };

  const handleCheckboxChange = (email) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((selected) => selected !== email)
        : [...prevSelected, email]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents((prevSelected) =>
      prevSelected.length === students.length ? [] : students.map((student) => student.email)
    );
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(`${baseurl}/api/sendMessage`, {
        selectedStudents,
        message,
      });
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Error sending message');
    }
    setMessage('');
    setSelectedStudents([]);
  };

  return (
    <>
      <Navbar />
      <div className="update-container">
        <label>
          Update:
          <textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <div className="student-selection">
          <div className="select-all">
            <label className="all">
              Select All
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedStudents.length === students.length}
              />
            </label>
          </div>
          {students.map((student, index) => (
            <div key={student.id} className="student-checkbox">
              <span>{`${index + 1}. ${student.name}`}</span>
              <label htmlFor={`student-${index}`}>
                <input
                  type="checkbox"
                  id={`student-${index}`}
                  onChange={() => handleCheckboxChange(student.email)}
                  checked={selectedStudents.includes(student.email)}
                />
              </label>
            </div>
          ))}
        </div>
        <button className="submit-button" onClick={handleSendMessage}>
          Send Message
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
};

export default TutorUpdates;
