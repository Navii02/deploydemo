import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './PrinciNavbar'; 

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [hods, setHods] = useState([]);
  const [assignedTeacher, setAssignedTeacher] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null); // State to store the selected teacher ID for HOD assignment

  useEffect(() => {
    fetchTeachers();
    fetchHODs();
  }, []);

  const fetchTeachers = () => {
    axios.get('/api/hod/teachers')
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  };

  const fetchHODs = () => {
    axios.get('/api/hod/hods')
      .then(response => {
        setHods(response.data);
      })
      .catch(error => {
        console.error('Error fetching HODs:', error);
      });
  };

  const assignHOD = (teacherId) => {
    axios.post('/api/hod/assign', { teacherId })
      .then(response => {
        console.log('HOD assigned successfully:', response.data);
        setAssignedTeacher(response.data.teachername);
        setSelectedTeacherId(null); // Reset selected teacher ID
        fetchTeachers();
      })
      .catch(error => {
        console.error('Error assigning HOD:', error);
      });
  };

  return (
    <div>
      <Navbar /> {/* Assuming your Navbar component is correctly implemented */}
      <div className="teacher-list-container">
        <div>
          <h3>List of Teachers</h3>
          <ul>
            {teachers.map(teacher => (
              <li key={teacher._id}>
                {teacher.teachername}
                <button onClick={() => setSelectedTeacherId(teacher._id)}>Assign as HOD</button>
                {assignedTeacher && assignedTeacher === teacher.teachername && (
                  <p>{teacher.teachername} has been assigned as HOD successfully!</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Render HOD assignment section only when a teacher is selected */}
        {selectedTeacherId && (
          <div>
            <h3>Assign HOD</h3>
            <p>Selected Teacher: {teachers.find(teacher => teacher._id === selectedTeacherId)?.teachername}</p>
            <button onClick={() => assignHOD(selectedTeacherId)}>Confirm Assign as HOD</button>
            <button onClick={() => setSelectedTeacherId(null)}>Cancel</button>
          </div>
        )}

        {/* List of HODs */}
        <div>
          <h3>List of HODs</h3>
          <ul>
            {hods.map(hod => (
              <li key={hod._id}>
                  <strong>LoginID</strong> {hod.customId}<br />
                <strong>Name:</strong> {hod.teachername}<br />
                <strong>Department:</strong> {hod.branches}<br />
                <strong>Email:</strong> {hod.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherList;
