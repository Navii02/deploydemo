import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OfficerNavbar from './OfficerNavbar';

const ApprovedAndRemoved = () => {
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [removedStudents, setRemovedStudents] = useState([]);
  const [showRemoved, setShowRemoved] = useState(false);
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
    plusTwo: {
      board: '',
      regNo: '',
      examMonthYear: '',
      percentage: '',
      schoolName: '',
      physics: '',
      chemistry: '',
      mathematics: ''
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
    // Fetch approved students from the server
    axios.get('/api/approvedStudents')
      .then(response => {
        const currentYear = new Date().getFullYear().toString().slice(-2);
        const filteredStudents = response.data.filter(student => {
          const admissionYear = student.admissionNumber.split('/')[1];
          return admissionYear === currentYear;
        });
        setApprovedStudents(filteredStudents);
      })
      .catch(error => {
        console.error('Error fetching approved students:', error);
      });

    // Fetch removed students from the server
    axios.get('/api/removedStudents')
      .then(response => {
        setRemovedStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching removed students:', error);
      });
  }, []);


  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/updateStudent/${studentId}`, formData)
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
    axios.get(`/api/approvedstudentDetails/${_id}`)
      .then(response => {
        const studentDetails = response.data.studentDetails;
        console.log(studentDetails.photoUrl);

        if (!studentDetails || !studentDetails.parentDetails) {
          console.error('Error: Invalid student details received');
          return;
        }
        const formattedDate = new Date(studentDetails.dateOfBirth).toISOString().split('T')[0];
        const formattedDateOfBirth = new Date(formattedDate).toLocaleDateString('en-US');
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
      <td>${formattedDateOfBirth}</td>
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
  <td>Entrance Exam Name</td>
<td>${studentDetails.entranceExam}</td>
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
 
  const handleBackToApproved = () => {
    setShowRemoved(false);
  };
  const handleShowRemoved = () => {
    setShowRemoved(true);
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
      plusTwo: {
        board: student.plusTwo.board || '',
        regNo: student.plusTwo.regNo || '',
        examMonthYear: student.plusTwo.examMonthYear || '',
        percentage: student.plusTwo.percentage || '',
        schoolName: student.plusTwo.schoolName || '',
        physics: student.plusTwo.physics || '',
        chemistry: student.plusTwo.chemistry || '',
        mathematics: student.plusTwo.mathematics || ''
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
        others: student.achievements.others ||'',
      },
      
      annualIncome: student.annualIncome || '',
      nativity: student.nativity || ''
    });
  };

  return (
    <div>
      <OfficerNavbar />
      {/* Course Filter */}
      {!editMode &&!showRemoved && (
      <div>
        <label htmlFor="course">Select Department: </label>
        <select id="course" value={selectedCourse} onChange={handleCourseChange}>
          <option value="">All</option>
          <option value="computerScience">Computer Science (CSE)</option>
          <option value="electronicsAndCommunication">Electronics and Communication (EC)</option>
        </select>
      </div>
  )}
      {/* Approved Students */}
      {!editMode &&!showRemoved && (
        <div>
          <h2>Approved Students</h2>
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
                  // Apply filter for course
                  let passCourseFilter = !selectedCourse || String(student.course) === selectedCourse;
                  return passCourseFilter;
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

      {/* Show Removed Students Button */}
      {!editMode &&!showRemoved && (
        <button className="show-non-approved-button" onClick={handleShowRemoved}>Show Removed Students</button>
      )}

      {/* Removed Students */}
      {!editMode && showRemoved && (
        <div>
          <h2>Removed Students</h2>
          <table>
            <thead>
              <tr>
                <th>Admission ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {removedStudents.map(student => (
                <tr key={student.admissionId}>
                  <td>{student.admissionId}</td>
                  <td>{student.name}</td>
                  <td>{student.course}</td>
                  <td>
                   
                    <button onClick={() => handlePrintPreview(student._id)}>Print Preview</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleBackToApproved}>Back to Approved Students</button>
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
            <div className="box">
              <h4>Plus Two Details</h4>
              <div className="form-group">
                <label>Board:</label>
                <input
                  type="text"
                  name="plusTwo.board"
                  value={formData.plusTwo.board}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Register No:</label>
                <input
                  type="text"
                  name="plusTwo.regNo"
                  value={formData.plusTwo.regNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Exam Month and Year:</label>
                <input
                  type="text"
                  name="plusTwo.examMonthYear"
                  value={formData.plusTwo.examMonthYear}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Percentage:</label>
                <input
                  type="text"
                  name="plusTwo.percentage"
                  value={formData.plusTwo.percentage}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>School Name:</label>
                <input
                  type="text"
                  name="plusTwo.schoolName"
                  value={formData.plusTwo.schoolName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Physics:</label>
                <input
                  type="text"
                  name="plusTwo.physics"
                  value={formData.plusTwo.physics}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Chemistry:</label>
                <input
                  type="text"
                  name="plusTwo.chemistry"
                  value={formData.plusTwo.chemistry}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mathematics:</label>
                <input
                  type="text"
                  name="plusTwo.mathematics"
                  value={formData.plusTwo.mathematics}
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
          
            <button type="submit">Save Changes</button>
          </form>
          {isSuccess && <div className="success-message">Data successfully edited. Reloading...</div>}
        </div>
      )}
    </div>
  );
};

export default ApprovedAndRemoved;