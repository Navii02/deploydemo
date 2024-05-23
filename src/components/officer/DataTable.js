import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./OfficerNavbar";
import './DataTable.css'

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
        if (error.response && error.response.data) {
          console.error('Server Error:', error.response.data);
        }
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

  const handlePrintPreview = (_id,photoUrl) => {
    // Log the student ID when clicking on "Print Preview"
    console.log('Student ID for Print Preview:', _id);
    console.log('Photo URL:', photoUrl);

    // Fetch the details of the selected student
    axios.get(`/api/studentDetails/${_id}`)
      .then(response => {
        const studentDetails = response.data.studentDetails;
        console.log(studentDetails.photoUrl);

        if (!studentDetails || !studentDetails.parentDetails) {
          console.error('Error: Invalid student details received');
          return;
        }

        // Open a new tab with the student details for print preview
        const printWindow = window.open('', '_blank');
        const formatDate = (dateString) => {
          const dateOfBirth = new Date(dateString);
          const day = String(dateOfBirth.getDate()).padStart(2, '0');
          const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0'); // Months are zero-based
          const year = dateOfBirth.getFullYear();
          return `${day}-${month}-${year}`;
        };
        const admissionID=studentDetails.admissionId;
// Example function to calculate academic year from admission ID year
const getAcademicYear = (admissionID) => {
  // Extract the year from the admission ID
  const yearString = admissionID.split('/')[1];
  const year = parseInt(yearString) ;

  // Calculate the next year
  const nextYear = year + 1;

  // Format academic year as "yyyy-yyyy"
  const academicYear = `${year}-${nextYear.toString().slice(-2)}`;

  return academicYear;
};

const academicYear = getAcademicYear(admissionID);
console.log(academicYear); // Output: "2024-25"


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
                right: 0px; /* Adjust as needed */
                top: 0px; /* Adjust as needed */
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
            <tr style="height: 100px;">
            <td colspan="2" class="header">
            <img src="/images/college__2_-removebg-preview.png" alt="College Logo" class="logo" width="100">
              COLLEGE OF ENGINEERING POONJAR
              <br />
              Managed by IHRD, Govt. of Kerala
              <br />
              Poonjar Thekkekara P.O. Kottayam Dist. PIN 686 582
              <br/>
            
              Academic Year: ${academicYear}
              <img src="${studentDetails.photoUrl}" alt="Student Photo" class="photo" width="91" height="129.5">
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
      <td>${formatDate(studentDetails.dateOfBirth)}</td>
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
  <td>Exam Name</td>
<td>${studentDetails.entranceExam}</td>
</tr>
<tr>
<td>Roll No</td>
<td>${studentDetails.entranceRollNo}</td>
</tr>
<tr>
<td>Rank</td>
<td>${studentDetails.entranceRank}</td>
</tr>
<tr>
<td colspan="2" style="text-align: center; font-weight: bold;">Qualifying Examination Details</td>
</tr>
<tr>
  <td>Qualification</td>
  <td>${studentDetails.qualify?.exam}</td>
</tr>
<tr>
  <td>Exam Board</td>
  <td>${studentDetails.qualify?.board}</td>
</tr>
<tr>
  <td>Institution Name</td>
  <td>${studentDetails.qualify?.institution}</td>
</tr>
<tr>
  <td>Register No</td>
  <td>${studentDetails.qualify?.regNo}</td>
</tr>
<tr>
  <td>Exam Month and Year</td>
  <td>${studentDetails.qualify?.examMonthYear}</td>
</tr>
<tr>
  <td>Percentage</td>
  <td>${studentDetails.qualify?.percentage}</td>
</tr>
<tr>
  <td>CGPA</td>
  <td>${studentDetails.qualify?.cgpa}</td>
</tr>
<tr>
<td colspan="2" style="text-align: center; font-weight: bold;">Parents Details</td>
</tr>
<tr>
<td>Father's Name</td>
<td>${studentDetails.parentDetails?.fatherName}</td>
</tr>
<tr>
<td>Father's Occupation</td>
<td>${studentDetails.parentDetails?.fatherOccupation}</td>
</tr>
<tr>
<td>Father's Mobile No</td>
<td>${studentDetails.parentDetails?.fatherMobileNo}</td>
</tr>
<tr>
<td>Mother's Name</td>
<td>${studentDetails.parentDetails?.motherName}</td>
</tr>
<tr>
<td>Mother's Occupation</td>
<td>${studentDetails.parentDetails?.motherOccupation}</td>
</tr>
<tr>
<td>Mother's Mobile No</td>
<td>${studentDetails.parentDetails?.motherMobileNo}</td>
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
    <tr>
    <td colspan="2" style="text-align: center; font-weight: bold;">Achievements</td>
  </tr>
  <tr>
      <td>Arts</td>
      <td>${studentDetails.achievements.arts}</td>
    </tr>
    <tr>
      <td>Sports</td>
      <td>${studentDetails.achievements.sports}</td>
    </tr>
    <tr>
      <td>Other</td>
      <td>${studentDetails.achievements.other}</td>
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
      <Navbar />
      <table class="students-table">
  <thead>
    <tr>
      <th class="name-column">Name</th>
      <th class="actions-column">Actions</th>
    </tr>
  </thead>
  <tbody>
    {students.map(student => (
      <tr key={student._id}>
        <td class="name-cell">{student.name}</td>
        <td class="actions-cell">
          <button class="approve-btn" onClick={() => handleApprove(student._id)}>Approve</button>
          <button class="decline-btn" onClick={() => handleDecline(student._id)}>Decline</button>
          <button class="print-preview-btn" onClick={() => handlePrintPreview(student._id,student.photo)}>Print Preview</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
};

export default StudentList;
