import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

import './HodTeachersPage.css'; // Assuming this CSS file exists
import HodNavbar from './HodNavbar';

const branchOptions = [
  { value: "B.Tech CSE", label: "B.Tech CSE" },
  { value: "B.Tech ECE", label: "B.Tech ECE" },
  { value: "MCA", label: "MCA" },
  { value: "BBA", label: "BBA" },
  { value: "BCA", label: "BCA" }
];

const semesterOptions = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" }
];

const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    teachername: '',
    email: '',
    MobNo: '',
    branches: [],
    semesters: [],
    subjects: []
  });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState([]);

  const fetchTeachers = async () => {
    try {
      const storedBranch = localStorage.getItem('branch');
      const response = await axios.get(`/api/admin/teachers?branch=${storedBranch}`);
      setTeachers(response.data.teachers);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error fetching teachers');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchSubjects = async (branches, semesters) => {
    try {
      const response = await axios.get(`/api/subjects`, {
        params: {
          branches: branches.join(','),
          semesters: semesters.join(',')
        }
      });
      // Format subjects to include only names
      setSubjectOptions(response.data.subjects.map(subject => ({ value: subject.subjectName, label: subject.subjectName })));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error fetching subjects');
    }
  };

  const handleAddTeacher = async () => {
    try {
      const department = localStorage.getItem('branch');
      await axios.post(`/api/admin/addTeacher`, { ...newTeacher, department: department });
      fetchTeachers();
      setNewTeacher({
        teachername: '',
        email: '',
        MobNo: '',
        branches: [],
        semesters: [],
        subjects: []
      });
      setShowAddTeacher(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error adding teacher');
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      await axios.put(`/api/admin/updateTeacher/${editingTeacher._id}`, { ...editingTeacher });
      fetchTeachers();
      setEditingTeacher(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error updating teacher');
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`/api/admin/deleteTeacher/${teacherId}`);
      fetchTeachers();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error deleting teacher');
    }
  };

  const handleEditingBranchesChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setEditingTeacher({ ...editingTeacher, branches: selectedValues });
    if (selectedValues.length && editingTeacher.semesters.length) {
      fetchSubjects(selectedValues, editingTeacher.semesters);
    }
  };

  const handleEditingSemestersChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setEditingTeacher({ ...editingTeacher, semesters: selectedValues });
    if (editingTeacher.branches.length && selectedValues.length) {
      fetchSubjects(editingTeacher.branches, selectedValues);
    }
  };

  const handleEditingSubjectsChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setEditingTeacher({ ...editingTeacher, subjects: selectedValues });
  };

  return (
    <div>
      <HodNavbar />
      <div>
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
                  <th>Number</th>
                  <th>Branches</th>
                  <th>Semesters</th>
                  <th>Subjects</th>
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
                            type="email"
                            value={editingTeacher.email}
                            onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingTeacher.MobNo}
                            onChange={(e) => setEditingTeacher({ ...editingTeacher, MobNo: e.target.value })}
                          />
                        </td>
                        <td>
                          <Select
                            isMulti
                            value={branchOptions.filter(option => editingTeacher.branches.includes(option.value))}
                            onChange={handleEditingBranchesChange}
                            options={branchOptions}
                          />
                        </td>
                        <td>
                          <Select
                            isMulti
                            value={semesterOptions.filter(option => editingTeacher.semesters.includes(option.value))}
                            onChange={handleEditingSemestersChange}
                            options={semesterOptions}
                          />
                        </td>
                        <td>
                          <Select
                            isMulti
                            value={subjectOptions.filter(option => editingTeacher.subjects.includes(option.value))}
                            onChange={handleEditingSubjectsChange}
                            options={subjectOptions}
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
                        <td>{teacher.MobNo}</td>
                        <td>{teacher.branches.join(', ')}</td>
                        <td>{teacher.semesters.join(', ')}</td>
                        <td>{teacher.subjects.join(', ')}</td>
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
                type="email"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              />
            </label>
            <label>
              Number:
              <input
                type="text"
                value={newTeacher.MobNo}
                onChange={(e) => setNewTeacher({ ...newTeacher, MobNo: e.target.value })}
              />
            </label>
            <label>
              Branches:
              <Select
                isMulti
                value={branchOptions.filter(option => newTeacher.branches.includes(option.value))}
                onChange={(selectedOptions) => setNewTeacher({ ...newTeacher, branches: selectedOptions.map(option => option.value) })}
                options={branchOptions}
              />
            </label>
            <label>
              Semesters:
              <Select
                isMulti
                value={semesterOptions.filter(option => newTeacher.semesters.includes(option.value))}
                onChange={(selectedOptions) => setNewTeacher({ ...newTeacher, semesters: selectedOptions.map(option => option.value) })}
                options={semesterOptions}
              />
            </label>
            <label>
              Subjects:
              <Select
                isMulti
                value={subjectOptions.filter(option => newTeacher.subjects.includes(option.value))}
                onChange={(selectedOptions) => setNewTeacher({ ...newTeacher, subjects: selectedOptions.map(option => option.value) })}
                options={subjectOptions}
              />
            </label>
            <button onClick={handleAddTeacher}>Add Teacher</button>
          </div>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
    </div>
  );
};

export default AdminTeachersPage;
