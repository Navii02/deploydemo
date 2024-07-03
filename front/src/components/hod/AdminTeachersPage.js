import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {baseurl} from '../../url';
import './AdminTeachersPage.css'; // Assuming this CSS file exists
import HodNavbar from './HodNavbar';

const branchOptions = [
  { value: "BTech CSE", label: "BTech CSE" },
  { value: "BTech ECE", label: "BTech ECE" },
  { value: "MCA", label: "MCA" },
  { value: "BBA", label: "BBA" },
  { value: "BCA", label: "BCA" },
  
 
];

const AdminTeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    teachername: '',
    email: '',
    subjects: [], // Change to array
    subjectCode: [], // Change to array
    branches: [], // Change to array
    semesters: [], // Change to array
    course: ''
  });
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddTeacher, setShowAddTeacher] = useState(false); // State to toggle add teacher section visibility
  
  const fetchTeachers = async () => {
    try {
      const storedBranch = localStorage.getItem('branch');
      const response = await axios.get(`${baseurl}/api/admin/teachers?branch=${storedBranch}`);
      console.log(storedBranch);
      setTeachers(response.data.teachers);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error fetching teachers');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = async () => {
    try {
      const department = localStorage.getItem('branch');
      await axios.post(`${baseurl}/api/admin/addTeacher`, { ...newTeacher, department: department });
      fetchTeachers();
      
      // Resetting form fields
      setNewTeacher({
        teachername: '',
        email: '',
        subjects: [],
        subjectCode: [],
        branches: [],
        semesters: [],
        course: ''
      });
      setShowAddTeacher(false); // Hide the add teacher section after adding
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error adding teacher');
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      await axios.put(`${baseurl}/api/admin/updateTeacher/${editingTeacher._id}`, { ...editingTeacher });
      fetchTeachers();
      setEditingTeacher(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error updating teacher');
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      await axios.delete(`${baseurl}/api/admin/deleteTeacher/${teacherId}`);
      fetchTeachers();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error deleting teacher');
    }
  };

  // Helper function to handle array input change
  const handleArrayInputChange = (fieldName, e) => {
    // Convert comma-separated values into an array
    const newArray = e.target.value.split(',').map(item => item.trim());
    setNewTeacher({ ...newTeacher, [fieldName]: newArray });
  };

  const handleBranchesChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setNewTeacher({ ...newTeacher, branches: selectedValues });
  };

  return (
    <div>
      <HodNavbar />
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
                  <th>Subject Code</th>
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
                            type="email"
                            value={editingTeacher.email}
                            onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingTeacher.subjects.join(', ')} // Display as comma-separated string
                            onChange={(e) => setEditingTeacher({ ...editingTeacher, subjects: e.target.value.split(',').map(item => item.trim()) })}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingTeacher.subjectCode.join(', ')} // Display as comma-separated string
                            onChange={(e) => setEditingTeacher({ ...editingTeacher, subjectCode: e.target.value.split(',').map(item => item.trim()) })}
                          />
                        </td>
                        <td>
                          <Select
                            isMulti
                            value={branchOptions.filter(option => editingTeacher.branches.includes(option.value))}
                            onChange={(selectedOptions) => setEditingTeacher({ ...editingTeacher, branches: selectedOptions.map(option => option.value) })}
                            options={branchOptions}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editingTeacher.semesters.join(', ')} // Display as comma-separated string
                            onChange={(e) => setEditingTeacher({ ...editingTeacher, semesters: e.target.value.split(',').map(item => item.trim()) })}
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
                        <td>{teacher.subjects.join(', ')}</td> {/* Display as comma-separated string */}
                        <td>{teacher.subjectCode.join(', ')}</td> {/* Display as comma-separated string */}
                        <td>{teacher.branches.join(', ')}</td> {/* Display as comma-separated string */}
                        <td>{teacher.semesters.join(', ')}</td> {/* Display as comma-separated string */}
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
              Branches:
              <Select
                isMulti
                value={branchOptions.filter(option => newTeacher.branches.includes(option.value))}
                onChange={handleBranchesChange}
                options={branchOptions}
              />
            </label>
            <label>
              Semesters (comma-separated):
              <input
                type="text"
                value={newTeacher.semesters.join(', ')} // Display as comma-separated string
                onChange={(e) => handleArrayInputChange('semesters', e)}
              />
            </label>
            <label>
              Subjects (comma-separated):
              <input
                type="text"
                value={newTeacher.subjects.join(', ')} // Display as comma-separated string
                onChange={(e) => handleArrayInputChange('subjects', e)}
              />
            </label>
            <label>
              Subject Code (comma-separated):
              <input
                type="text"
                value={newTeacher.subjectCode.join(', ')} // Display as comma-separated string
                onChange={(e) => handleArrayInputChange('subjectCode', e)}
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
