import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminTeachersPage.css'; // Assuming this CSS file exists
import './HodNavbar'
import HodNavbar from './HodNavbar';

const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ teachername: '', email: '', subjects: '', subjectCode:'', branches: '', semesters: '' });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddTeacher, setShowAddTeacher] = useState(false); // State to toggle add teacher section visibility
  
    // Fetch branch from localStorage
    const storedBranch = localStorage.getItem('branch');
 console.log(storedBranch);
 const fetchTeachers = async () => {
  try {
    const storedBranch = localStorage.getItem('branch');
    const response = await axios.get(`/api/admin/teachers?branch=${storedBranch}`);
    setTeachers(response.data.teachers);
  } catch (error) {
    setErrorMessage(error.response.data.message);
  }
};

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async () => {
    try {
      await axios.post('/api/admin/addTeacher', newTeacher);
      fetchTeachers();
      setNewTeacher({ teachername: '', email: '', subjects: '',subjectCode:'', branches: '', semesters: '' });
      setShowAddTeacher(false); // Hide the add teacher section after adding
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      await axios.put(`/api/admin/updateTeacher/${editingTeacher._id}`, editingTeacher);
      fetchTeachers();
      setEditingTeacher(null);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`/api/admin/deleteTeacher/${teacherId}`);
      fetchTeachers();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <HodNavbar/>
    <div className="admin-teachers-page">
    <div className="teachers-list-section">
  {teachers.length === 0 ? (
    <p>No teachers available.</p>
  ) : (
    <table className="teachers-list">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Subjects</th>
          <th>subjectCode</th>
          <th>Branches</th>
          <th>Semesters</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {teachers.map((teacher) => (
          <tr key={teacher._id}>
            {editingTeacher && editingTeacher._id === teacher._id ? (
              <>
                <td>
                  <input
                    type="text"
                    value={editingTeacher.teachername}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, teachername: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingTeacher.email}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingTeacher.subjects}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, subjects: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingTeacher.subjectCode}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, subjectCode: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingTeacher.branches}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, branches: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editingTeacher.semesters}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, semesters: e.target.value })}
                  />
                </td>
                <td>
                  <button onClick={handleUpdateTeacher}>Update</button>
                </td>
              </>
            ) : (
              <>
                <td>{teacher.teachername}</td>
                <td>{teacher.email}</td>
                <td>{teacher.subjects}</td>
                <td>{teacher.subjectCode}</td>
                <td>{teacher.branches}</td>
                <td>{teacher.semesters}</td>
                <td>
                  <button onClick={() => setEditingTeacher(teacher)}>Edit</button>
                  <button onClick={() => handleDeleteTeacher(teacher._id)}>Delete</button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
      <button className="add-new-teacher-btn" onClick={() => setShowAddTeacher(!showAddTeacher)}>
        {showAddTeacher ? 'Hide Add Teacher' : 'Add a New Teacher'}
      </button>

      {showAddTeacher && (
        <div className="add-teacher-section">
          <h3>Add New Teacher</h3>
          <label>
            Name:
            <input
              type="text"
              value={newTeacher.teachername}
              onChange={(e) => setNewTeacher({ ...newTeacher, teachername: e.target.value })}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
            />
          </label>
          <label>
            Subjects:
            <input
              type="text"
              value={newTeacher.subjects}
              onChange={(e) => setNewTeacher({ ...newTeacher, subjects: e.target.value })}
            />
          </label>
          <label>
            SubjectCode:
            <input
              type="text"
              value={newTeacher.subjectCode}
              onChange={(e) => setNewTeacher({ ...newTeacher, subjectCode: e.target.value })}
            />
          </label>
          <label>
            Branches:
            <input
              type="text"
              value={newTeacher.branches}
              onChange={(e) => setNewTeacher({ ...newTeacher, branches: e.target.value })}
            />
          </label>
         
          <label>
            Semesters:
            <input
              type="text"
              value={newTeacher.semesters}
              onChange={(e) => setNewTeacher({ ...newTeacher, semesters: e.target.value })}
            />
          </label>
          <label>
            Course:
            <input
              type="text"
              value={newTeacher.course}
              onChange={(e) => setNewTeacher({ ...newTeacher, course: e.target.value })}
            />
          </label>
          <button onClick={handleAddTeacher}>Add Teacher</button>
        </div>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
    </div>
  );
};

export default AdminTeachersPage;