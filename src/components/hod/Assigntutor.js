import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';

function AssignTutorPage() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    const department = localStorage.getItem('branch');
    try {
      const response = await axios.get(`/api/tutors?department=${department}`);
      setTutors(response.data.map(tutor => ({ _id: tutor._id, name: tutor.name }))); // Map response data to include only _id and name fields
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  };

  const handleAssignTutor = async () => {
    try {
      if (!selectedTutor || !academicYear || !selectedCourse) {
        console.error('Please select tutor, academic year, and course');
        return;
      }
  
      await axios.post('/api/tutors/assign', { tutorId: selectedTutor, academicYear, course: selectedCourse });
      console.log('Tutor assigned successfully');
      setAssignSuccess(true); // Set assignSuccess state to true on successful assignment
      // Refetch tutors after assignment to update the list
      fetchTutors();
    } catch (error) {
      console.error('Error assigning tutor:', error);
    }
  };

  // Filter tutors to exclude those who are already assigned
  const availableTutors = tutors.filter((tutor) => !tutor.isAssigned);

  return (
    <div>
      <HodNavbar />
      <div>
        &nbsp;
        <label htmlFor="academicYear">Academic Year:</label>
        <input
          type="text"
          id="academicYear"
          value={academicYear}
          onChange={(e) => setAcademicYear(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="course">Select Course:</label>
        <select
          id="course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Select Course</option>
          <option value="CSE">CSE</option>
          <option value="CSE">ECE</option>
          <option value="MCA">MCA</option>
          <option value="BCA">BCA</option>
          <option value="BBA">BBA</option>
          {/* Add more options for other courses */}
        </select>
      </div>
      <div>
        <label htmlFor="tutor">Select Tutor:</label>
        <select
          id="tutor"
          value={selectedTutor}
          onChange={(e) => setSelectedTutor(e.target.value)}
          //style={{ color: 'black', backgroundColor: 'white' }}
        >
          <option value="">Select Tutor</option>
          {availableTutors.map((tutor) => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name}
            </option>
          ))}
        </select>
        &nbsp;
      </div>
      <button onClick={handleAssignTutor}>Assign Tutor</button>
      {assignSuccess && <p style={{ color: 'green' }}>Tutor assigned successfully!</p>}
    </div>
  );
}

export default AssignTutorPage;
