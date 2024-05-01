import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';

function AssignTutorPage() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false); // State to track assignment success

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    const department = localStorage.getItem('branch');
    try {
      const response = await axios.get(`/api/tutors?department=${department}`);
      setTutors(response.data);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  };

  const handleAssignTutor = async () => {
    try {
      if (!selectedTutor) {
        console.error('No tutor selected');
        return;
      }
  
      await axios.post('/api/tutors/assign', { tutorId: selectedTutor, academicYear });
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
        <label htmlFor="tutor">Select Tutor:</label>
        <select
          id="tutor"
          value={selectedTutor}
          onChange={(e) => setSelectedTutor(e.target.value)}
          style={{ color: 'black', backgroundColor: 'white' }}
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
