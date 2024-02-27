// StudentList.js
import React from "react";

function StudentList({ title, students, updateStudentStatus }) {
  const handleStatusChange = (studentId, status) => {
    updateStudentStatus(studentId, status);
  };

  return (
    <div>
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <button onClick={() => handleStatusChange(student.id, "accepted")}>
                  Approve
                </button>
                <button onClick={() => handleStatusChange(student.id, "rejected")}>
                  Reject
                </button>
                {/* Add Edit and Remove buttons with appropriate handlers */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;
