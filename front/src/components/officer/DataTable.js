import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./OfficerNavbar";
import './DataTable.css';
import { baseurl } from '../../url';

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${baseurl}/api/studentAdmission`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleApprove = async (_id) => {
    try {
      await axios.post(`${baseurl}/api/approve/${_id}`);
      setStudents(prevStudents => prevStudents.filter(student => student._id !== _id));
    } catch (error) {
      console.error('Error approving student:', error);
    }
  };

  const handleDecline = async (_id) => {
    try {
      await axios.post(`${baseurl}/api/decline/${_id}`);
      setStudents(prevStudents => prevStudents.filter(student => student._id !== _id));
    } catch (error) {
      console.error('Error declining student:', error);
    }
  };
  const handlePrintPreview = async (_id, photoPath) => {
    try {
      const photoUrl = `${baseurl}/api/image/${encodeURIComponent(photoPath)}`;
      const response = await axios.get(`${baseurl}/api/studentDetails/${_id}`);
      const studentDetails = response.data.studentDetails;

      if (!studentDetails || !studentDetails.parentDetails) {
        console.error('Error: Invalid student details received');
        return;
      }

      const formatDate = (dateString) => {
        const dateOfBirth = new Date(dateString);
        const day = String(dateOfBirth.getDate()).padStart(2, '0');
        const month = String(dateOfBirth.getMonth() + 1).padStart(2, '0');
        const year = dateOfBirth.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const admissionID = studentDetails.admissionId;
      const getAcademicYear = (admissionID) => {
        const year = parseInt(admissionID.split('/')[1]);
        const nextYear = year + 1;
        return `${year}-${nextYear.toString().slice(-2)}`;
      };

      const academicYear = getAcademicYear(admissionID);

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
            }
            td, th {
              border: 1pt solid black;
              padding: 5pt;
            }
            .header {
              text-align: center;
              position: relative;
            }
            .logo {
              position: absolute;
              left: 10px;
              top: 5px;
            }
            .photo {
              position: absolute;
              right: 0px;
              top: 0px;
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
                <img src="${photoUrl}" alt="Student Photo" class="photo" width="91" height="129.5">
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
            <td>Permanent Address</td>
            <td>${studentDetails.permanentAddress ?? 'Nil'}</td>
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
  <td>${studentDetails.qualify?.exam ?? 'Nil'}</td>
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
<td>${studentDetails.parentDetails?.fatherName ?? 'Nil'}</td>
</tr>
<tr>
<td>Father's Occupation</td>
<td>${studentDetails.parentDetails?.fatherOccupation ?? 'Nil'}</td>
</tr>
<tr>
<td>Father's Mobile No</td>
<td>${studentDetails.parentDetails?.fatherMobileNo ?? 'Nil'}</td>
</tr>
<tr>
<td>Mother's Name</td>
<td>${studentDetails.parentDetails?.motherName ?? 'Nil'}</td>
</tr>
<tr>
<td>Mother's Occupation</td>
<td>${studentDetails.parentDetails?.motherOccupation ?? 'Nil'}</td>
</tr>
<tr>
<td>Mother's Mobile No</td>
<td>${studentDetails.parentDetails?.motherMobileNo ?? 'Nil'}</td>
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
      <td>${studentDetails.achievements.arts?? 'Nil'}</td>
    </tr>
    <tr>
      <td>Sports</td>
      <td>${studentDetails.achievements.sports?? 'Nil'}</td>
    </tr>
    <tr>
      <td>Other</td>
      <td>${studentDetails.achievements.other ?? 'Nil'}</td>
    </tr>
            </table>
            <button class="hide-on-print" onclick="window.print()">Print</button>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
    } catch (error) {
      console.error('Error generating print preview:', error);
    }
  };



  return (
    <div>
      <Navbar />
      <h1>Student List</h1>
      <table className="students-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Admission ID</th>
            <th>Course</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.admissionId}</td>
              <td>{student.course}</td>
              <td>
                <button className="approve-btn" onClick={() => handleApprove(student._id)}>Approve</button>
                <button className="decline-btn" onClick={() => handleDecline(student._id)}>Decline</button>
                <button className="print-preview-btn" onClick={() => handlePrintPreview(student._id, student.photo)}>Print Preview</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
