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

        if (!studentDetails || !studentDetails.parentDetails) {
          console.error('Error: Invalid student details received');
          return;
        }

        // Open a new tab with the student details for print preview
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <title>${studentDetails.name}'s Details</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: Calibri, sans-serif;
                font-size: 11pt;
              }

              h1 {
                font-weight: bold;
                text-align: center;
              }

              table {
                border-collapse: collapse;
                width: 100%;
                page-break-before: always; /* Ensure each table starts on a new page */
              }

              td,
              th {
                border: 1pt solid black;
                padding: 5pt;
              }

              .header {
                text-align: center;
                position: relative;
              }

              .logo {
                position: absolute;
                left: 10px; /* Adjust as needed */
                top: 5px; /* Adjust as needed */
              }

              .photo {
                position: absolute;
                right: 10px; /* Adjust as needed */
                top: 5px; /* Adjust as needed */
              }

              @media print {
                .hide-on-print {
                  display: none;
                }

                .print-table {
                  page-break-inside: avoid;
                }
              }

              @page {
                size: A4;
              }

              /* Add more styles as needed for printing */

            </style>
          </head>
          <body>
            <table class="print-table">
            <tr>
            <td colspan="2" class="header">
            <img src="/images/college__2_-removebg-preview.png" alt="College Logo" class="logo" width="100">
              COLLEGE OF ENGINEERING POONJAR
              <br />
              Managed by IHRD, Govt. of Kerala
              <br />
              Poonjar Thekkekara P.O. Kottayam Dist. PIN 686 582
              <br/>
              Academic Year: 2023-24
              <img
              class="photo"
              src="{${studentDetails.photo }}"
              alt="Student Photo"
            />
            </td>
          </tr>
          <tr>
            <td colspan="2" style="font-weight:bold;">Admission ID: ${studentDetails.admissionId}</td>
          </tr>
          <tr>
            <td>Admission Type</td>
            <td>${studentDetails.admissionType}</td>
          </tr>
          <tr>
            <td>Allotment Category</td>
            <td>${studentDetails.allotmentCategory}</td>
          </tr>
          <tr>
            <td>Fee Category</td>
            <td>${studentDetails.feeCategory}</td>
          </tr>
          <tr>
            <td>Course</td>
            <td>${studentDetails.course}</td>
          </tr>
          <tr>
          <td colspan="2" style="text-align: center; font-weight: bold;">Student Details</td>
        </tr>
          <tr>
            <td>Name of the Candidate</td>
            <td>${studentDetails.name}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>${studentDetails.address}</td>
          </tr>
          <tr>
            <td>Pin Code</td>
            <td>${studentDetails.pincode}</td>
          </tr>
          <tr>
          <td>Religion</td>
          <td>${studentDetails.religion}</td>
        </tr>
        <tr>
          <td>Community</td>
          <td>${studentDetails.community}</td>
        </tr>
        <tr>
          <td>Gender</td>
          <td>${studentDetails.gender}</td>
        </tr>
        <tr>
      <td>Date of Birth</td>
      <td>${studentDetails.dateOfBirth}</td>
    </tr>
    <tr>
      <td>Blood Group</td>
      <td>${studentDetails.bloodGroup}</td>
    </tr>
    <tr>
      <td>Mobile No</td>
      <td>${studentDetails.mobileNo}</td>
    </tr>
    <tr>
      <td>WhatsApp No</td>
      <td>${studentDetails.whatsappNo}</td>
    </tr>
    <tr>
      <td>Email</td>
      <td>${studentDetails.email}</td>
    </tr>
    <tr>
      <td>Aadhar No</td>
      <td>${studentDetails.aadharNo}</td>
    </tr>
    <tr>
      <td>Nativity</td>
      <td>${studentDetails.nativity}</td>
    </tr>
    <tr>
    <td colspan="2" style="text-align: center; font-weight: bold;">Entrance Exam Details</td>
  </tr>
  <tr>
  <td>Entrance Exam</td>
<td>
${studentDetails.entranceExam.name}
</td>
</tr>
<tr>
<td>Entrance Roll No</td>
<td>${studentDetails.entranceRollNo}</td>
</tr>
<tr>
<td>Entrance Rank</td>
<td>${studentDetails.entranceRank}</td>
</tr>
<tr>
<td colspan="2" style="text-align: center; font-weight: bold;">Plus Two Details</td>
</tr>
<tr>
  <td>Plus Two Board</td>
  <td>${studentDetails.plusTwo?.board}</td>
</tr>
<tr>
  <td>Plus Two Register No</td>
  <td>${studentDetails.plusTwo?.regNo}</td>
</tr>
<tr>
  <td>Plus Two Exam Month and Year</td>
  <td>${studentDetails.plusTwo?.examMonthYear}</td>
</tr>
<tr>
  <td>Plus Two Percentage</td>
  <td>${studentDetails.plusTwo?.percentage}</td>
</tr>
<tr>
  <td>Plus Two School Name</td>
  <td>${studentDetails.plusTwo?.schoolName}</td>
</tr>
<tr>
  <td>Plus Two Physics</td>
  <td>${studentDetails.plusTwo?.physics}</td>
</tr>
<tr>
  <td>Plus Two Chemistry</td>
  <td>${studentDetails.plusTwo?.chemistry}</td>
</tr>
<tr>
  <td>Plus Two Mathematics</td>
  <td>${studentDetails.plusTwo?.mathematics}</td>
</tr>
<tr>
<td colspan="2" style="text-align: center; font-weight: bold;">Parents Details</td>
</tr>
<tr>
<td>Father's Name</td>
<td>${studentDetails.parentDetails.fatherName}</td>
</tr>
<tr>
<td>Father's Occupation</td>
<td>${studentDetails.parentDetails.fatherOccupation}</td>
</tr>
<tr>
<td>Father's Mobile No</td>
<td>${studentDetails.parentDetails.fatherMobileNo}</td>
</tr>
<tr>
<td>Mother's Name</td>
<td>${studentDetails.parentDetails.motherName}</td>
</tr>
<tr>
<td>Mother's Occupation</td>
<td>${studentDetails.parentDetails.motherOccupation}</td>
</tr>
<tr>
<td>Mother's Mobile No</td>
<td>${studentDetails.parentDetails.motherMobileNo}</td>
</tr>
<tr>
      <td>Annual Income</td>
      <td>${studentDetails.annualIncome}</td>
    </tr>
    <tr>
    <td colspan="2" style="text-align: center; font-weight: bold;">Bank Account Details</td>
  </tr>
    <tr>
      <td>Bank Name</td>
      <td>${studentDetails.bankDetails.bankName}</td>
    </tr>
    <tr>
      <td>Bank Branch</td>
      <td>${studentDetails.bankDetails.branch}</td>
    </tr>
    <tr>
      <td>Bank Account No</td>
      <td>${studentDetails.bankDetails.accountNo}</td>
    </tr>
    <tr>
      <td>IFSC Code</td>
      <td>${studentDetails.bankDetails.ifscCode}</td>
    </tr>
            </table>
            <button class="hide-on-print" onclick="window.print()">Print</button>
          </body>
          </html>
        `);

      })
      .catch(error => {
        console.error('Error fetching student details:', error);

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
                <button className="hide-on-print" onClick={() => handlePrintPreview(student._id)}>Print Preview</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
