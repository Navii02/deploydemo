import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {baseurl} from '../../url';
import Navbar from './OfficerNavbar';

const ApprovedAndRemoved = () => {
  const [approvedStudents, setApprovedStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    pincode: '',
    religion: '',
    community: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    mobileNo: '',
    whatsappNo: '',
    email: '',
    entranceExam: '',
    entranceRollNo: '',
    entranceRank: '',
    aadharNo: '',
    course: '',
    qualify: {
      exam: '',
      board: '',
      regNo: '',
      examMonthYear: '',
      percentage: '',
      cgpa:'',
      institution: '',
    },
    parentDetails: {
      fatherName: '',
      fatherOccupation: '',
      fatherMobileNo: '',
      motherName: '',
      motherOccupation: '',
      motherMobileNo: ''
    },
    bankDetails: {
      bankName: '',
      branch: '',
      accountNo: '',
      ifscCode: ''
    },
    achievements: {
      arts: '',
      sports:'',
      other: '',
    },

    annualIncome: '',
    nativity: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // New state variable for success message


  useEffect(() => {
    axios.get(`${baseurl}/api/approvedStudents`)
      .then(response => {
        setApprovedStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching approved students:', error);
      });

    });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${baseurl}/api/updateStudent/${studentId}`, formData)
      .then(response => {
        console.log('Student details updated successfully:', response.data);
        setEditMode(false);
        setIsSuccess(true); // Update state variable to indicate success
        // Reload the screen
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Reload after 2 seconds
      })
      .catch(error => {
        console.error('Error updating student details:', error);
      });
  };


  const handlePrintPreview = (_id) => {
    console.log('Admission ID for Print Preview:', _id);
    axios.get(`${baseurl}/api/approvedstudentDetails/${_id}`)
      .then(response => {
        const studentDetails = response.data.studentDetails;
        //console.log(studentDetails);
        console.log(studentDetails.photoUrl);

        if (!studentDetails || !studentDetails.parentDetails) {
          console.error('Error: Invalid student details received');
          return;
        }
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
        
 

        const printWindow = window.open('', '_blank');
        //const formattedDateOfBirth = new Date(student.dateOfBirth).toISOString().split('T')[0];
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
      page-break-before: always;
    }

    td, th {
      border: 1pt solid black;
      padding: 5pt;
    }

    th {
      background-color: #f2f2f2;
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
        <div>
          <strong>COLLEGE OF ENGINEERING POONJAR</strong><br />
          Managed by IHRD, Govt. of Kerala<br />
          Poonjar Thekkekara P.O. Kottayam Dist. PIN 686 582<br />
          Academic Year: ${academicYear}
        </div>
        <img src="${baseurl}/${studentDetails.photoUrl}" alt="Student Photo" class="photo" width="91" height="129.5">
      </td>
    </tr>
    <tr>
      <td colspan="2" style="font-weight:bold;">Admission No: ${studentDetails.admissionNumber}</td>
    </tr>
    <tr>
      <th colspan="2">Admission Details</th>
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
      <th colspan="2">Student Details</th>
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
      <th colspan="2">Entrance Exam Details</th>
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
      <th colspan="2">Qualifying Examination Details</th>
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
      <th colspan="2">Parents Details</th>
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
      <th colspan="2">Bank Account Details</th>
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
      <th colspan="2">Achievements</th>
    </tr>
    <tr>
      <td>Arts</td>
      <td>${studentDetails.achievements.arts ?? 'Nil'}</td>
    </tr>
    <tr>
      <td>Sports</td>
      <td>${studentDetails.achievements.sports ?? 'Nil'}</td>
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
      })
      .catch(error => {
        console.error('Error fetching student details:', error);
        if (error.response && error.response.data) {
          console.error('Server Error:', error.response.data);
        }
      });
  };

 

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };
  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleEdit = (student) => {
     // Check if the selected student matches the current filter criteria
  const passCourseFilter = !selectedCourse || String(student.course) === selectedCourse;
  
  if (!passCourseFilter) {
    // Reset the course filter to show all students
    setSelectedCourse('');
  }
  
  // Set the editing mode and form data
  setEditMode(true);
  setStudentId(student._id);
    
    // Format the date of birth in YYYY-MM-DD format
    const formattedDateOfBirth = new Date(student.dateOfBirth).toISOString().split('T')[0];

    setFormData({
      ...formData,
      name: student.name,
      address: student.address,
      permanentAddress:student.permanentAddress,
      pincode: student.pincode,
      religion: student.religion,
      community: student.community,
      gender: student.gender,
      dateOfBirth: formattedDateOfBirth,
      bloodGroup: student.bloodGroup,
      mobileNo:  student.mobileNo,
      whatsappNo: student.whatsappNo,
      email: student.email,
      entranceExam: student.entranceExam,
      entranceRollNo: student.entranceRollNo,
      entranceRank: student.entranceRank,
      aadharNo: student.aadharNo,
      course: student.course,
      nativity: student.nativity,
      annualIncome: student.annualIncome,
      qualify: {
        exam:student.qualify.exam || '',
        board:student.qualify.board || '',
        regNo:student.qualify.regNo|| '',
        examMonthYear:student.qualify.examMonthYear|| '',
        percentage:student.qualify.percentage|| '',
        cgpa:student.qualify.cgpa|| '',
        institution:student.qualify.institution|| '',
      },
      parentDetails: {
        fatherName: student.parentDetails.fatherName || '',
        fatherOccupation: student.parentDetails.fatherOccupation || '',
        fatherMobileNo: student.parentDetails.fatherMobileNo || '',
        motherName: student.parentDetails.motherName || '',
        motherOccupation: student.parentDetails.motherOccupation || '',
        motherMobileNo: student.parentDetails.motherMobileNo || ''
      },
      bankDetails: {
        bankName: student.bankDetails.bankName || '',
        branch: student.bankDetails.branch || '',
        accountNo: student.bankDetails.accountNo || '',
        ifscCode: student.bankDetails.ifscCode || ''
      },
      achievements:{
        arts: student.achievements.arts ||'',
        sports: student.achievements.sports || '',
        other: student.achievements.other ||'',
      },
    });
  };

  return (
    <div>
      <Navbar />
      {/* Course Filter */}
      {!editMode && (
        <div>
          <label htmlFor="course">Select Department: </label>
          <select id="course" value={selectedCourse} onChange={handleCourseChange}>
            <option value="">All</option>
            <option value="B.Tech CSE">Computer Science (CSE)</option>
            <option value="B.Tech ECE">Electronics and Communication (EC)</option>
            <option value="MCA">MCA</option>
            <option value="BCA">BCA</option>
            <option value="BBA">BBA</option>
          </select>
          &nbsp;
          <label htmlFor="semester">Select Semester: </label>
          <select id="semester" value={selectedSemester} onChange={handleSemesterChange}>
            <option value="">All</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
            <option value="4">Semester 4</option>
            <option value="5">Semester 5</option>
            <option value="6">Semester 6</option>
            <option value="7">Semester 7</option>
            <option value="8">Semester 8</option>
            {/* Add more semester options if needed */}
          </select>
        </div>
      )}

      {/* Approved Students */}
      {!editMode && (
        <div>
          &nbsp;
          <table>
            <thead>
              <tr>
                <th>Admission Number</th>
                <th>Name</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedStudents
                .filter(student => {
                  let passCourseFilter = !selectedCourse || String(student.course) === selectedCourse;
                  let passSemesterFilter = !selectedSemester || String(student.semester) === selectedSemester;
                  return passCourseFilter && passSemesterFilter;
                })
                .map(student => (
                  <tr key={student.admissionNumber}>
                    <td>{student.admissionNumber}</td>
                    <td>{student.name}</td>
                    <td>{student.course}</td>
                    <td>
                      <button onClick={() => handlePrintPreview(student._id)}>Print Preview</button>
                      <button onClick={() => handleEdit(student)}>Edit</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

     
      {/* Edit Mode */}
      {editMode && (
        <div>
          <h2>Edit Student Details</h2>
          <button onClick={() => setEditMode(false)}>Back to Student Details</button>
          <form onSubmit={handleSubmit}>
            {/* Existing fields */}
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Pin Code:</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Religion:</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Community:</label>
              <input
                type="text"
                name="community"
                value={formData.community}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="transgender">Transgender</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Blood Group:</label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mobile No:</label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>
            <div className="form-group">
              <label>WhatsApp No:</label>
              <input
                type="tel"
                name="whatsappNo"
                value={formData.whatsappNo}
                onChange={handleInputChange}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Aadhar No:</label>
              <input
                type="text"
                name="aadharNo"
                value={formData.aadharNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Entrance Exam Name:</label>
              <input
                type="text"
                name="entranceExam"
                value={formData.entranceExam}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Entrance Roll No:</label>
              <input
                type="text"
                name="entranceRollNo"
                value={formData.entranceRollNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Entrance Rank:</label>
              <input
                type="text"
                name="entranceRank"
                value={formData.entranceRank}
                onChange={handleInputChange}
                required
              />
            </div>
          
            <div className="box">
              <h4>Qualifying Examination Details</h4>
              <div className="form-group">
                <label>Qualification:</label>
                <input
                  type="text"
                  name="qualify.exam"
                  value={formData.qualify.exam}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Board:</label>
                <input
                  type="text"
                  name="qualify.board"
                  value={formData.qualify.board}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Institution:</label>
                <input
                  type="text"
                  name="qualify.institution"
                  value={formData.qualify.institution}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Register No:</label>
                <input
                  type="text"
                  name="qualify.RegNo"
                  value={formData.qualify.regNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Exam Month and Year:</label>
                <input
                  type="text"
                  name="plusTwo.examMonthYear"
                  value={formData.qualify.examMonthYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Percentage:</label>
                <input
                  type="text"
                  name="plusTwo.percentage"
                  value={formData.qualify.percentage}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>CGPA:</label>
                <input
                  type="text"
                  name="qualify.CGPA"
                  value={formData.qualify.cgpa}
                  onChange={handleInputChange}
                  required
                />
              </div>
              </div>
            <div className="box">
              <h4>Parent Details</h4>
              <div className="form-group">
                <label>Father Name:</label>
                <input
                  type="text"
                  name="parentDetails.fatherName"
                  value={formData.parentDetails.fatherName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Father Occupation:</label>
                <input
                  type="text"
                  name="parentDetails.fatherOccupation"
                  value={formData.parentDetails.fatherOccupation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Father Mobile No:</label>
                <input
                  type="tel"
                  name="parentDetails.fatherMobileNo"
                  value={formData.parentDetails.fatherMobileNo}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
              <div className="form-group">
                <label>Mother Name:</label>
                <input
                  type="text"
                  name="parentDetails.motherName"
                  value={formData.parentDetails.motherName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mother Occupation:</label>
                <input
                  type="text"
                  name="parentDetails.motherOccupation"
                  value={formData.parentDetails.motherOccupation}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mother Mobile No:</label>
                <input
                  type="tel"
                  name="parentDetails.motherMobileNo"
                  value={formData.parentDetails.motherMobileNo}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Annual Income:</label>
              <input
                type="text"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nativity:</label>
              <input
                type="text"
                name="nativity"
                value={formData.nativity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="box">
              <h4>Bank Details</h4>
            <div className="form-group">
              <label>Bank Name:</label>
              <input
                type="text"
                name="bankDetails.bankName"
                value={formData.bankDetails.bankName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Branch:</label>
              <input
                type="text"
                name="bankDetails.branch"
                value={formData.bankDetails.branch}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Account No:</label>
              <input
                type="text"
                name="bankDetails.accountNo"
                value={formData.bankDetails.accountNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>IFSC Code:</label>
              <input
                type="text"
                name="bankDetails.ifscCode"
                value={formData.bankDetails.ifscCode}
                onChange={handleInputChange}
                required
              />
            </div>
            </div>
            <div className="box">
              <h4>Achievements</h4>
            <div className="form-group">
              <label>Arts:</label>
              <input
                type="text"
                name="achievements.arts"
                value={formData.achievements.arts}
                onChange={handleInputChange}
                
              />
            </div>
            <div className="form-group">
              <label>sports:</label>
              <input
                type="text"
                name="achivements.sports"
                value={formData.achievements.sports}
                onChange={handleInputChange}
              
              />
            </div>
            <div className="form-group">
              <label>Other:</label>
              <input
                type="text"
                name="achivements.other"
                value={formData.achievements.other}
                onChange={handleInputChange}
                
              />
            </div>
            
            </div>
          
          
            <button type="submit">Save Changes</button>
          </form>
          {isSuccess && <div className="success-message">Data successfully edited. Reloading...</div>}
        </div>
      )}
    </div>
  );
};

export default ApprovedAndRemoved;