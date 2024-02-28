// Your React component file (e.g., StudentList.js)
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch students from the server
    axios.get('/api/studentAdmission')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const handleApprove = (_id) => {
    axios.post(`/api/approve/${_id}`)
      .then(response => {
        setMessage(response.data.message);
        // Reload the students after approval
        window.location.reload();
      })
      .catch(error => {
        console.error('Error approving student:', error);
      });
  };

  const handleDecline = (_id) => {
    axios.post(`/api/decline/${_id}`)
      .then(response => {
        setMessage(response.data.message);
        // Reload the students after declining
        window.location.reload();
      })
      .catch(error => {
        console.error('Error declining student:', error);
      });
  };

  return (
    <div>
      <h1>Student List</h1>
      {message && <p>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>
                <button onClick={() => handleApprove(student._id)}>Approve</button>
                <button onClick={() => handleDecline(student._id)}>Decline</button>
                {/* Add a button for previewing */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
