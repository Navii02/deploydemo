import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './PrinciNavbar'; 

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [hods, setHods] = useState([]);
  const [assignedTeacher, setAssignedTeacher] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null); // State to store the selected teacher ID for HOD assignment
  const [showAddHodForm, setShowAddHodForm] = useState(false); // State to control showing the HOD form
  const [newHod, setNewHod] = useState({
    teachername: '',
    email: '',
    branches: '',
    semesters: '',
    subjects: '',
    subjectCode: '',
    academicYear: '',
  });

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

  const handleAddHodChange = (e) => {
    const { name, value } = e.target;
    setNewHod((prevNewHod) => ({ ...prevNewHod, [name]: value }));
  };

  const handleAddHodSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/admin/addTeacher', newHod)
      .then(response => {
        console.log('HOD added successfully:', response.data);
        setShowAddHodForm(false);
        setNewHod({
          teachername: '',
          email: '',
          branches: '',
          semesters: '',
          subjects: '',
          subjectCode: '',
          academicYear: '',
        });
        fetchTeachers();
        fetchHODs();
      })
      .catch(error => {
        console.error('Error adding HOD:', error);
      });
  };

  return (
    <div>
      <Navbar />
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

        <div>
          <h3>List of HODs</h3>
          <ul>
            {hods.map(hod => (
              <li key={hod._id}>
                <strong>LoginID:</strong> {hod.customId}<br />
                <strong>Name:</strong> {hod.teachername}<br />
                <strong>Department:</strong> {hod.branches}<br />
                <strong>Email:</strong> {hod.email}
              </li>
            ))}
          </ul>
        </div>

        {/* Button to show HOD form */}
        <button onClick={() => setShowAddHodForm(true)}>Add New HOD</button>

        {/* Form to add a new HOD */}
        {showAddHodForm && (
          <div>
            <h3>Add New HOD</h3>
            <form onSubmit={handleAddHodSubmit}>
              <input
                type="text"
                name="teachername"
                placeholder="Teacher Name"
                value={newHod.teachername}
                onChange={handleAddHodChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newHod.email}
                onChange={handleAddHodChange}
                required
              />
              <input
                type="text"
                name="branches"
                placeholder="Branches"
                value={newHod.branches}
                onChange={handleAddHodChange}
                required
              />
              <input
                type="text"
                name="semesters"
                placeholder="Semesters"
                value={newHod.semesters}
                onChange={handleAddHodChange}
                required
              />
              <input
                type="text"
                name="subjects"
                placeholder="Subjects"
                value={newHod.subjects}
                onChange={handleAddHodChange}
                required
              />
              <input
                type="text"
                name="subjectCode"
                placeholder="Subject Code"
                value={newHod.subjectCode}
                onChange={handleAddHodChange}
                required
              />
            
              <button type="submit">Add HOD</button>
              <button type="button" onClick={() => setShowAddHodForm(false)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
