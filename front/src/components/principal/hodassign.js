import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './PrinciNavbar';
import {baseurl} from '../../url';
import './Hodassign.css'; // Import CSS file for styling

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [hods, setHods] = useState([]);
  const [assignedTeacher, setAssignedTeacher] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [showAddHodForm, setShowAddHodForm] = useState(false);
  const [newHod, setNewHod] = useState({
    teachername: '',
    email: '',
    branches: '',
    semesters: '',
    subjects: '',
    subjectCode: '',
    department: '',
  });

  useEffect(() => {
    fetchTeachers();
    fetchHODs();
  }, []);

  const fetchTeachers = () => {
    axios.get(`${baseurl}/api/hod/teachers`)
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  };

  const fetchHODs = () => {
    axios.get(`${baseurl}/api/hod/hods`)
      .then(response => {
        setHods(response.data);
      })
      .catch(error => {
        console.error('Error fetching HODs:', error);
      });
  };

  const assignHOD = (teacherId) => {
    const selectedTeacher = teachers.find(teacher => teacher._id === teacherId);
    if (!selectedTeacher) return;

    axios.post(`${baseurl}/api/hod/assign`, { teacherId, department: selectedTeacher.department })
      .then(response => {
        console.log('HOD assigned successfully:', response.data);
        setAssignedTeacher(response.data.teachername);
        setSelectedTeacherId(null);
        fetchTeachers();
        fetchHODs();
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
    axios.post(`${baseurl}/api/admin/addTeacher`, newHod)
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
          department: '',
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
                <strong>Name:</strong> {teacher.teachername}<br />
                <strong>Department:</strong> {teacher.department}<br />
                <strong>Email:</strong> {teacher.email}<br />
                <button className="assign-button" onClick={() => setSelectedTeacherId(teacher._id)}>Assign as HOD</button>
                {assignedTeacher && assignedTeacher === teacher.teachername && (
                  <p className="success-message">{teacher.teachername} has been assigned as HOD successfully!</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {selectedTeacherId && (
          <div>
            <h3>Assign HOD</h3>
            <p>Selected Teacher: {teachers.find(teacher => teacher._id === selectedTeacherId)?.teachername}</p>
            <button className="assign-button" onClick={() => assignHOD(selectedTeacherId)}>Confirm Assign as HOD</button>
            <button className="cancel-button" onClick={() => setSelectedTeacherId(null)}>Cancel</button>
          </div>
        )}

        <div>
          <h3>List of HODs</h3>
          <ul>
            {hods.map(hod => (
              <li key={hod._id} className="hod-item">
                <strong>Name:</strong> {hod.teachername}<br />
                <strong>Department:</strong> {hod.department}<br />
                <strong>Email:</strong> {hod.email}
              </li>
            ))}
          </ul>
        </div>

        <button className="add-hod-button" onClick={() => setShowAddHodForm(true)}>Add New HOD</button>

        {showAddHodForm && (
          <div className="add-hod-form">
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
              <select
                name="semesters"
                value={newHod.semesters}
                onChange={handleAddHodChange}
                required
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>
              <select
                name="department"
                value={newHod.department}
                onChange={handleAddHodChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CS">CS</option>
                <option value="EC">EC</option>
                <option value="EE">EE</option>
                <option value="Aplied Science">Aplied Science</option>
                
              </select>
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
              <button type="button" className="cancel-button" onClick={() => setShowAddHodForm(false)}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherList;
