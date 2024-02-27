// StudentListPage.js
import React, { useState } from "react";

function StudentListPage({ students }) {
  const [showApproved, setShowApproved] = useState(true);

  const handleEdit = (studentId) => {
    console.log(`Edit student with ID: ${studentId}`);
  };

  const handleRemove = (studentId) => {
    console.log(`Remove student with ID: ${studentId}`);
  };

  const handleApprove = (studentId) => {
    console.log(`Approve student with ID: ${studentId}`);
  };

  const handleViewDetails = (studentId) => {
    console.log(`View details of student with ID: ${studentId}`);
  };

  const handleShowApprovedChange = () => {
    setShowApproved(!showApproved);
  };

 


  return (
    <div>
      <h1>Student List</h1>
      <div>
        <label>Show Approved Students:</label>
        <input
          type="checkbox"
          checked={showApproved}
          onChange={handleShowApprovedChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Admission ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            (showApproved || student.approved) && (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.admissionId}</td>
                <td>
                  <button onClick={() => handleEdit(student.id)}>Edit</button>
                  <button onClick={() => handleRemove(student.id)}>Remove</button>
                  {!student.approved && (
                    <button onClick={() => handleApprove(student.id)}>Approve</button>
                  )}
                  <select onChange={() => handleViewDetails(student.id)}>
                    <option value="">Select</option>
                    <option value="view">View Details</option>
                  </select>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentListPage;

