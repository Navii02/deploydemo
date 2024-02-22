import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({ teachername: '',email: '', subjects: '', branches: '', semesters: '' });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/api/admin/teachers');
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
      setNewTeacher({ teachername: '',email: '', subjects: '', branches: '', semesters: '' });
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
    <div className="admin-teachers-page">
      <h2>Teachers Management</h2>

      <div>
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
        <button onClick={handleAddTeacher}>Add Teacher</button>
      </div>

      <div>
        <h3>Teachers List</h3>
        {teachers.length === 0 ? (
          <p>No teachers available.</p>
        ) : (
          <ul>
            {teachers.map((teacher) => (
              <li key={teacher._id}>
                {editingTeacher && editingTeacher._id === teacher._id ? (
                  <>
                    <input
                      type="text"
                      value={editingTeacher.teachername}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                    />
                      <input
                      type="text"
                      value={editingTeacher.email}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editingTeacher.subjects}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, subjects: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editingTeacher.branches}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, branches: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editingTeacher.semesters}
                      onChange={(e) => setEditingTeacher({ ...editingTeacher, semesters: e.target.value })}
                    />
                    <button onClick={handleUpdateTeacher}>Update</button>
                  </>
                ) : (
                  <>
                   name: {teacher.teachername} - email:{teacher.email} - Subjects: {teacher.subjects} - Branches: {teacher.branches} - Semesters: {teacher.semesters}
                    <button onClick={() => setEditingTeacher(teacher)}>Edit</button>
                    <button onClick={() => handleDeleteTeacher(teacher._id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default AdminTeachersPage;
