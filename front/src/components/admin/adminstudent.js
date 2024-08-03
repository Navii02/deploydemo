import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminUserManagement.css';
import Navbar from './AdminNavbar';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [userStatus, setUserStatus] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/api/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserStatus = async (userId) => {
    try {
      const response = await axios.get(` /api/userStatus/${userId}`);
      setUserStatus((prev) => ({ ...prev, [userId]: response.data }));
      
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  const handleUpdateUser = async (id) => {
    try {
      await axios.put(`/api/users/${id}`, editUser);
      fetchUsers();
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    users.forEach(user => fetchUserStatus(user._id));
  }, [users]);
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
<div>

<Navbar />

    <div className="admin-user-management">
      <h1>User Management</h1>
      <div className="user-list">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            {editUser && editUser._id === user._id ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={editUser.name}
                  onChange={handleEditChange}
                />
                <input
                  type="email"
                  name="email"
                  value={editUser.email}
                  onChange={handleEditChange}
                />
                <input
                  type="text"
                  name="role"
                  value={editUser.role}
                  onChange={handleEditChange}
                />
                <button onClick={() => handleUpdateUser(user._id)}>Save</button>
                <button onClick={() => setEditUser(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Role: {user.role}</p>
                {userStatus[user._id] && (
                  <>
                     <p>Created At: {formatDate(userStatus[user._id].createdAt)}</p>
                    <p>Status: {userStatus[user._id].status}</p>
                    {userStatus[user._id].status === 'not a member' && <p>This user is not a member of CEP.</p>}
                  </>
                )}
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default AdminUserManagement;
