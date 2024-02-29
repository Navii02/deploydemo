// StudentList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);

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
        console.log(response.data);
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
        console.log(response.data);
        // Reload the students after declining
        window.location.reload();
      })
      .catch(error => {
        console.error('Error declining student:', error);
      });
  };

  const handlePrintPreview = (_id) => {
    // Log the student ID when clicking on "Print Preview"
    console.log('Student ID for Print Preview:', _id);

    // Fetch the details of the selected student
    axios.get(`/api/studentDetails/${_id}`)
      .then(response => {
        const studentDetails = response.data.studentDetails;

        // Check if the response contains studentDetails and parentDetails
        if (!studentDetails || !studentDetails.parentDetails) {
          console.error('Error: Invalid student details received');
          return;
        }

        const { parentDetails } = studentDetails;

        // Open a new tab with the student details for print preview
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>${studentDetails.name}'s Details</title>
            </head>
            <body>
              <h1>${studentDetails.name}'s Details</h1>
              <p>Admission Type: ${studentDetails.admissionType}</p>
              <p>Admission ID: ${studentDetails.admissionId}</p>
              <p>Allotment Category: ${studentDetails.allotmentCategory}</p>
              <p>Fee Category: ${studentDetails.feeCategory}</p>
              <p>Address: ${studentDetails.address}</p>
              <!-- Add more details as needed -->
              <!-- ... -->
              <p>Parent Details:</p>
              <ul>
                <li>Father: ${parentDetails.father.name}</li>
                <li>Father Occupation: ${parentDetails.father.occupation}</li>
                <li>Father Mobile No: ${parentDetails.father.mobileNo}</li>
                <li>Mother: ${parentDetails.mother.name}</li>
                <li>Mother Occupation: ${parentDetails.mother.occupation}</li>
                <li>Mother Mobile No: ${parentDetails.mother.mobileNo}</li>
              </ul>
            </body>
          </html>
        `);
      })
      .catch(error => {
        console.error('Error fetching student details:', error);

        // Log the specific error message received from the server
        if (error.response && error.response.data) {
          console.error('Server Error:', error.response.data);
        }
      });
  };

  return (
    <div>
      <h1>Student List</h1>
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
                <button onClick={() => handlePrintPreview(student._id)}>Print Preview</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
