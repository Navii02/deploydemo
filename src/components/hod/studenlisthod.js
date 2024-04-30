import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';

function StudentDetailsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student data based on the logged-in user's department
  const fetchStudents = async () => {
    const department = localStorage.getItem('userDepartment');

    try {
      const response = await axios.get(`/api/students?department=${department}`);
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // Fetch students on component mount

  return (
    <>
     <HodNavbar/>
      <div className="student-details-container">
        <h1>Student Details - {localStorage.getItem('userDepartment')}</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && students.length === 0 && <p>No students found.</p>}
        {!loading && !error && students.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Roll Number</th>
                <th>Name</th>
                <th>Department</th>
                {/* Add more fields as needed */}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.rollNumber}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.department}</td>
                  {/* Display more fields as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default StudentDetailsPage;
