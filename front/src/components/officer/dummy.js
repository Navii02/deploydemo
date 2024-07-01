import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OfficerNavbar from './OfficerNavbar'; // Assuming you want to use Navbar instead of OfficerNavbar

const ApprovedAndRemoved = () => {
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [removedStudents, setRemovedStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showRemoved, setShowRemoved] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    admissionNumber: '',
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
      sports: '',
      other: ''
    },
    annualIncome: '',
    nativity: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleEditClick = (student) => {
    setFormData(student);
    setIsEditing(true);
    setStudentId(student.id);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split('.');
    if (keys.length > 1) {
      setFormData(prevState => ({
        ...prevState,
        [keys[0]]: {
          ...prevState[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
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
                  Academic Year: 2023-24
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
                <td>Plus Two Exam Month/Year</td>
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
                <td>Physics</td>
                <td>${studentDetails.plusTwo?.physics}</td>
              </tr>
              <tr>
                <td>Chemistry</td>
                <td>${studentDetails.plusTwo?.chemistry}</td>
              </tr>
              <tr>
                <td>Mathematics</td>
                <td>${studentDetails.plusTwo?.mathematics}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center; font-weight: bold;">Parent Details</td>
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
                <td colspan="2" style="text-align: center; font-weight: bold;">Bank Details</td>
              </tr>
              <tr>
                <td>Bank Name</td>
                <td>${studentDetails.bankDetails?.bankName}</td>
              </tr>
              <tr>
                <td>Branch</td>
                <td>${studentDetails.bankDetails?.branch}</td>
              </tr>
              <tr>
                <td>Account No</td>
                <td>${studentDetails.bankDetails?.accountNo}</td>
              </tr>
              <tr>
                <td>IFSC Code</td>
                <td>${studentDetails.bankDetails?.ifscCode}</td>
              </tr>
              <tr>
                <td colspan="2" style="text-align: center; font-weight: bold;">Additional Information</td>
              </tr>
              <tr>
                <td>Arts</td>
                <td>${studentDetails.achievements?.arts}</td>
              </tr>
              <tr>
                <td>Sports</td>
                <td>${studentDetails.achievements?.sports}</td>
              </tr>
              <tr>
                <td>Other Achievements</td>
                <td>${studentDetails.achievements?.other}</td>
              </tr>
              <tr>
                <td>Annual Income</td>
                <td>${studentDetails.annualIncome}</td>
              </tr>
            </table>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      })
      .catch(error => {
        console.error('Error fetching student details:', error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedData = {
      ...formData,
      plusTwo: {
        board: formData.plusTwo.board,
        regNo: formData.plusTwo.regNo,
        examMonthYear: formData.plusTwo.examMonthYear,
        percentage: formData.plusTwo.percentage,
        schoolName: formData.plusTwo.schoolName,
        physics: formData.plusTwo.physics,
        chemistry: formData.plusTwo.chemistry,
        mathematics: formData.plusTwo.mathematics
      },
      parentDetails: {
        fatherName: formData.parentDetails.fatherName,
        fatherOccupation: formData.parentDetails.fatherOccupation,
        fatherMobileNo: formData.parentDetails.fatherMobileNo,
        motherName: formData.parentDetails.motherName,
        motherOccupation: formData.parentDetails.motherOccupation,
        motherMobileNo: formData.parentDetails.motherMobileNo
      },
      bankDetails: {
        bankName: formData.bankDetails.bankName,
        branch: formData.bankDetails.branch,
        accountNo: formData.bankDetails.accountNo,
        ifscCode: formData.bankDetails.ifscCode
      },
      achievements: {
        arts: formData.achievements.arts,
        sports: formData.achievements.sports,
        other: formData.achievements.other
      }
    };

    if (isEditing && studentId) {
      // Send the updated data to the server
      axios.put(`/api/student/${studentId}`, updatedData)
        .then(response => {
          console.log('Data updated successfully');
          setIsSuccess(true);
          setIsEditing(false);
          setStudentId(null);
          setFormData({
            name: '',
            admissionNumber: '',
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
              sports: '',
              other: ''
            },
            annualIncome: '',
            nativity: ''
          });

          // Fetch updated removed students from the server
          axios.get('/api/removedStudents')
            .then(response => {
              setRemovedStudents(response.data);
            })
            .catch(error => {
              console.error('Error fetching removed students:', error);
            });

        })
        .catch(error => {
          console.error('Error updating data:', error);
        });
    }
  };

  const handleShowRemoved = () => {
    setShowRemoved(true);
  };

  const handleBackToApproved = () => {
    setShowRemoved(false);
  };

  return (
    <div>
      <OfficerNavbar />
      {/* Course Filter */}
      <div>
        <label htmlFor="course">Select Department: </label>
        <select id="course" value={selectedCourse} onChange={handleCourseChange}>
          <option value="">All</option>
          <option value="computerScience">Computer Science (CSE)</option>
          <option value="electronicsAndCommunication">Electronics and Communication (EC)</option>
        </select>
      </div>

      {/* Approved Students */}
      {!showRemoved && (
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
                      <button onClick={() => handleEditClick(student)}>Edit</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show Removed Students Button */}
      {!showRemoved && (
        <button className="show-non-approved-button" onClick={handleShowRemoved}>Show Removed Students</button>
      )}

      {/* Removed Students */}
      {showRemoved && (
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

      {isEditing && (
        <form onSubmit={handleSubmit}>
          {/* Student details form */}
          <div>
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </label>
            <label>
              Admission Number:
              <input type="text" name="admissionNumber" value={formData.admissionNumber} onChange={handleInputChange} />
            </label>
            <label>
              Entrance Exam:
              <input type="text" name="entranceExam" value={formData.entranceExam} onChange={handleInputChange} />
            </label>
            <label>
              Entrance Roll No:
              <input type="text" name="entranceRollNo" value={formData.entranceRollNo} onChange={handleInputChange} />
            </label>
            <label>
              Entrance Rank:
              <input type="text" name="entranceRank" value={formData.entranceRank} onChange={handleInputChange} />
            </label>
            <label>
              Aadhar No:
              <input type="text" name="aadharNo" value={formData.aadharNo} onChange={handleInputChange} />
            </label>
            <label>
              Course:
              <input type="text" name="course" value={formData.course} onChange={handleInputChange} />
            </label>
          </div>

          {/* Plus two details form */}
          <div>
            <label>
              Plus Two Board:
              <input type="text" name="plusTwo.board" value={formData.plusTwo.board} onChange={handleInputChange} />
            </label>
            <label>
              Plus Two Register No:
              <input type="text" name="plusTwo.regNo" value={formData.plusTwo.regNo} onChange={handleInputChange} />
            </label>
            <label>
              Plus Two Exam Month/Year:
              <input type="text" name="plusTwo.examMonthYear" value={formData.plusTwo.examMonthYear} onChange={handleInputChange} />
            </label>
            <label>
              Plus Two Percentage:
              <input type="text" name="plusTwo.percentage" value={formData.plusTwo.percentage} onChange={handleInputChange} />
            </label>
            <label>
              Plus Two School Name:
              <input type="text" name="plusTwo.schoolName" value={formData.plusTwo.schoolName} onChange={handleInputChange} />
            </label>
            <label>
              Physics:
              <input type="text" name="plusTwo.physics" value={formData.plusTwo.physics} onChange={handleInputChange} />
            </label>
            <label>
              Chemistry:
              <input type="text" name="plusTwo.chemistry" value={formData.plusTwo.chemistry} onChange={handleInputChange} />
            </label>
            <label>
              Mathematics:
              <input type="text" name="plusTwo.mathematics" value={formData.plusTwo.mathematics} onChange={handleInputChange} />
            </label>
          </div>

          {/* Parent details form */}
          <div>
            <label>
              Father's Name:
              <input type="text" name="parentDetails.fatherName" value={formData.parentDetails.fatherName} onChange={handleInputChange} />
            </label>
            <label>
              Father's Occupation:
              <input type="text" name="parentDetails.fatherOccupation" value={formData.parentDetails.fatherOccupation} onChange={handleInputChange} />
            </label>
            <label>
              Father's Mobile No:
              <input type="text" name="parentDetails.fatherMobileNo" value={formData.parentDetails.fatherMobileNo} onChange={handleInputChange} />
            </label>
            <label>
              Mother's Name:
              <input type="text" name="parentDetails.motherName" value={formData.parentDetails.motherName} onChange={handleInputChange} />
            </label>
            <label>
              Mother's Occupation:
              <input type="text" name="parentDetails.motherOccupation" value={formData.parentDetails.motherOccupation} onChange={handleInputChange} />
            </label>
            <label>
              Mother's Mobile No:
              <input type="text" name="parentDetails.motherMobileNo" value={formData.parentDetails.motherMobileNo} onChange={handleInputChange} />
            </label>
          </div>

          {/* Bank details form */}
          <div>
            <label>
              Bank Name:
              <input type="text" name="bankDetails.bankName" value={formData.bankDetails.bankName} onChange={handleInputChange} />
            </label>
            <label>
              Branch:
              <input type="text" name="bankDetails.branch" value={formData.bankDetails.branch} onChange={handleInputChange} />
            </label>
            <label>
              Account No:
              <input type="text" name="bankDetails.accountNo" value={formData.bankDetails.accountNo} onChange={handleInputChange} />
            </label>
            <label>
              IFSC Code:
              <input type="text" name="bankDetails.ifscCode" value={formData.bankDetails.ifscCode} onChange={handleInputChange} />
            </label>
          </div>

          {/* Achievements form */}
          <div>
            <label>
              Arts:
              <input type="text" name="achievements.arts" value={formData.achievements.arts} onChange={handleInputChange} />
            </label>
            <label>
              Sports:
              <input type="text" name="achievements.sports" value={formData.achievements.sports} onChange={handleInputChange} />
            </label>
            <label>
              Other Achievements:
              <input type="text" name="achievements.other" value={formData.achievements.other} onChange={handleInputChange} />
            </label>
            <label>
              Annual Income:
              <input type="text" name="annualIncome" value={formData.annualIncome} onChange={handleInputChange} />
            </label>
            <label>
              Nativity:
              <input type="text" name="nativity" value={formData.nativity} onChange={handleInputChange} />
            </label>
          </div>

          <button type="submit">Update</button>
        </form>
      )}

      {/* Success message */}
      {isSuccess && (
        <div>
          <p>Student information updated successfully!</p>
        </div>
      )}
    </div>
  );
};

export default ApprovedAndRemoved;
