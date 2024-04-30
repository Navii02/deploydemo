import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';

function AssignTutorPage() {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState('');
  const [academicYear, setAcademicYear] = useState('');

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    const department = localStorage.getItem('branch');
    console.log(department);
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
    } catch (error) {
      console.error('Error assigning tutor:', error);
    }
  };

  return (
    <div>
     <HodNavbar/>
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
          style={{ color: 'black', backgroundColor: 'white' }} // Apply inline styles
        >
          <option value="">Select Tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name}
            </option>
          ))}
        </select>
        &nbsp;
      </div>
      <button onClick={handleAssignTutor}>Assign Tutor</button>
    </div>
  );
}

export default AssignTutorPage;
