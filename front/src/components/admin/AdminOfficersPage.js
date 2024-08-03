import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from './AdminNavbar';
import './AdminOfficerPage.css';

import Loading from './Loading'; // Assuming you have a Loading component

const AdminOfficersPage = () => {
  const [officers, setOfficers] = useState([]);
  const [newOfficer, setNewOfficer] = useState({ name: '', post: '', email: '', number: '' });
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [isAddFormVisible, setIsAddFormVisible] = useState(false); // State for form visibility

  const fetchOfficers = async () => {
    try {
      const response = await axios.get(`/api/admin/officers`);
      setOfficers(response.data.officers);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setLoading(false); // Also set loading to false on error
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleAddOfficer = async () => {
    try {
      await axios.post(`/api/admin/addOfficer`, newOfficer);
      fetchOfficers();
      setNewOfficer({ name: '', post: '', email: '', number: '' });
      setIsAddFormVisible(false); // Hide the form after adding an officer
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleUpdateOfficer = async () => {
    try {
      await axios.put(`/api/admin/updateOfficer/${editingOfficer._id}`, editingOfficer);
      fetchOfficers();
      setEditingOfficer(null);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleDeleteOfficer = async (officerId) => {
    try {
      await axios.delete(`/api/admin/deleteOfficer/${officerId}`);
      fetchOfficers();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  if (loading) {
    return <Loading />; // Show loading indicator while fetching data
  }

  return (
    <div>
      <Navbar />
      <div className="admin-officers-page">
        &nbsp;
        <button onClick={() => setIsAddFormVisible(!isAddFormVisible)}>
          {isAddFormVisible ? 'Cancel' : 'Add Officer'}
        </button>
        {isAddFormVisible && (
          <>
            <h3>Add New Officer</h3>
            <label>
              Name:
              <input
                type="text"
                value={newOfficer.name}
                onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
              />
            </label>
            <label>
              Post:
              <input
                type="text"
                value={newOfficer.post}
                onChange={(e) => setNewOfficer({ ...newOfficer, post: e.target.value })}
              />
            </label>
            <label>
              Number:
              <input
                type="text"
                value={newOfficer.number}
                onChange={(e) => setNewOfficer({ ...newOfficer, number: e.target.value })}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                value={newOfficer.email}
                onChange={(e) => setNewOfficer({ ...newOfficer, email: e.target.value })}
              />
            </label>
            <button onClick={handleAddOfficer}>Add Officer</button>
          </>
        )}
      </div>
      &nbsp;
      <div>
        &nbsp;
        <h3>Officers List</h3>
        <ul>
          {officers.map((officer) => (
            <li key={officer._id}>
              {editingOfficer && editingOfficer._id === officer._id ? (
                <>
                  <input
                    type="text"
                    value={editingOfficer.name}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editingOfficer.post}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, post: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editingOfficer.number}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, number: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editingOfficer.email}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, email: e.target.value })
                    }
                  />
                  <button onClick={handleUpdateOfficer}>Update</button>
                </>
              ) : (
                <>
                  <div className="admin-officers-page">
                    <p>Name: {officer.name}</p>
                    <p>Post: {officer.post}</p>
                    <p>Email: {officer.email}</p>
                    <p>Number: {officer.number}</p>
                    <button onClick={() => setEditingOfficer(officer)}>Edit</button>
                    <button onClick={() => handleDeleteOfficer(officer._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default AdminOfficersPage;
