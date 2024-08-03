import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import OfficerNavbar from "./OfficerNavbar";
import { baseurl } from "../../url";
import "./DataEditing.css";
import "./StudentList.css";

const initialFormData = {
  name: "",
  address: "",
  permanentAddress: "",
  pincode: "",
  religion: "",
  community: "",
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  mobileNo: "",
  whatsappNo: "",
  email: "",
  entranceExam: "",
  entranceRollNo: "",
  entranceRank: "",
  aadharNo: "",
  course: "",
  qualify: {
    exam: "",
    board: "",
    regNo: "",
    examMonthYear: "",
    percentage: "",
    cgpa: "",
    institution: "",
  },
  parentDetails: {
    fatherName: "",
    fatherOccupation: "",
    fatherMobileNo: "",
    motherName: "",
    motherOccupation: "",
    motherMobileNo: "",
  },
  bankDetails: {
    bankName: "",
    branch: "",
    accountNo: "",
    ifscCode: "",
  },
  achievements: {
    arts: "",
    sports: "",
    other: "",
  },
  marks: {
    boardType: "",
    physics: "",
    chemistry: "",
    maths: "",
  },

  annualIncome: "",
  nativity: "",
};

const StudentListOfficer = () => {
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [showAlumni, setShowAlumni] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [editMode, setEditMode] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectCourse, setSelectCourse] = useState("");
  const [alumniYears, setAlumniYears] = useState([]);
  const [selectedAlumniYear, setSelectedAlumniYear] = useState("");

  const fetchApprovedStudents = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseurl}/api/officerstudent/approvedStudents`
      );
      const filteredStudents = selectedCourse
        ? response.data.filter((student) => student.course === selectedCourse)
        : response.data;
      setApprovedStudents(filteredStudents);
    } catch (error) {
      console.error("Error fetching approved students:", error);
    }
  }, [selectedCourse]); // Include selectedCourse in the dependency array

  const fetchAlumni = useCallback(async () => {
    try {
      const response = await axios.get(`${baseurl}/api/officerstudent/alumni`);
      const filteredAluminiStudents = selectCourse
        ? response.data.filter((student) => student.course === selectCourse)
        : response.data;
      setAlumni(filteredAluminiStudents);
      const uniqueYears = [
        ...new Set(response.data.map((student) => student.academicYear)),
      ];
      setAlumniYears(uniqueYears);
    } catch (error) {
      console.error("Error fetching alumni details:", error);
    }
  }, [selectCourse]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchApprovedStudents();
      await fetchAlumni();
    };
    fetchData();
  }, [fetchApprovedStudents, fetchAlumni]); // Include fetchApprovedStudents in the dependency array

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested state updates
    if (name.startsWith("qualify")) {
      const qualifyField = name.split(".")[1]; // Extract the field name from the nested object
      setFormData((prevFormData) => ({
        ...prevFormData,
        qualify: {
          ...prevFormData.qualify,
          [qualifyField]: value,
        },
      }));
    } else if (name.startsWith("parentDetails")) {
      const parentField = name.split(".")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        parentDetails: {
          ...prevFormData.parentDetails,
          [parentField]: value,
        },
      }));
    } else if (name.startsWith("bankDetails")) {
      const bankField = name.split(".")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        bankDetails: {
          ...prevFormData.bankDetails,
          [bankField]: value,
        },
      }));
    } else if (name.startsWith("achievements")) {
      const achievementField = name.split(".")[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        achievements: {
          ...prevFormData.achievements,
          [achievementField]: value,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const handleDelete = async (studentId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this student?");
    
    if (!isConfirmed) {
      return; // Exit if the user cancels the deletion
    }
  
    try {
      await axios.delete(`${baseurl}/api/officerstudent/deleteStudent/${studentId}`);
      setApprovedStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );
    } catch (error) {
      console.error("Error declining student:", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${baseurl}/api/officerstudent/updateStudent/${studentId}`,
        formData
      );
      setIsSuccess(true);
      setEditMode(false);
      // Refetch the student data instead of reloading the page
      const response = await axios.get(
        `${baseurl}/api/officerstudent/approvedStudents`
      );
      setApprovedStudents(
        response.data.filter(
          (student) =>
            student.admissionNumber.split("/")[1] ===
            new Date().getFullYear().toString().slice(-2)
        )
      );
    } catch (error) {
      console.error("Error updating student details:", error);
    }
  };

 
  const handlePrintPreview = async (_id, photoPath) => {
    try {
      const photoUrl = `${baseurl}/api/image/${encodeURIComponent(photoPath)}`;
      const response = await axios.get(
        `${baseurl}/api/approvedstudentDetails/${_id}`
      );
      const studentDetails = response.data.studentDetails;

      if (!studentDetails ) {
        console.error("Error: Invalid student details received");
        return;
      }

      function getTodaysDate() {
        const today = new Date();
        
        // Get the year, month, and day
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so +1 is used
        const day = String(today.getDate()).padStart(2, '0');
        
        // Return the date in YYYY-MM-DD format
        return `${day}-${month}-${year}`;
      }
      
      // Example usage
      //console.log(getTodaysDate()); // Outputs something like "2024-07-27"
      

      const formatDate = (dateString) => {
        const dateOfBirth = new Date(dateString);
        const day = String(dateOfBirth.getDate()).padStart(2, "0");
        const month = String(dateOfBirth.getMonth() + 1).padStart(2, "0");
        const year = dateOfBirth.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const admissionID = studentDetails.admissionId;
      const getAcademicYear = (admissionID) => {
        const yearPart = admissionID.split("/")[1];
        let year = parseInt(yearPart, 10);
      
        // If yearPart has only two digits, assume it's in the 2000s
        if (yearPart.length === 2) {
          year += 2000;
        }
      
        const nextYear = year + 1;
        return `${year}-${nextYear.toString().slice(-2)}`;
      };
      const academicYear = getAcademicYear(admissionID);

      const printWindow = window.open("", "_blank");
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
      font-size: 12pt;
    }
    h1, h2 {
      font-weight: bold;
      text-align: center;
      margin: 5pt 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      font-size: 11pt;
      table-layout: auto;
    }
    td, th {
      border: 1.5pt solid black;
      padding: 8pt;
    }
    .header {
      text-align: center;
      position: relative;
      padding: 10pt 0;
      font-size: 14pt;
      font-weight: bold;
    }
    .logo {
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .photo {
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .header-content {
      margin-top: 30px;
    }
    .header-content p {
      margin: 5pt 0;
    }
    .declaration {
      margin: 10px;
      font-size: 11pt;
    }
    .declaration p {
      margin: 3px 0;
    }
    .declaration .heading {
      text-align: center;
      font-weight: bold;
      font-size: 16pt;
      margin-bottom: 5pt;
    }
    .declaration .content {
      text-align: left;
      font-size: 13pt;
    }
    .signature {
      margin-top: 20px;
      font-size: 11pt;
      display: flex;
      justify-content: space-between;
    }
    .signature .left, .signature .right {
      width: 48%; /* Adjust width as needed */
    }
    .signature .left {
      text-align: left;
    }
    .signature .right {
      text-align: right;
    }
    .signature .field {
      margin-top: 15px;
    }
    @media print {
      .hide-on-print {
        display: none;
      }
    }
    @page {
      size: A4;
      margin: 10mm;
    }
  </style>
</head>
<body>
  <!-- Header Section -->
  <div class="header">
    <img src="/images/college__2_-removebg-preview.png" alt="College Logo" class="logo" width="100" height="125">
    <img src="${photoUrl}" alt="Student Photo" class="photo" width="91" height="129.5">
    <div class="header-content">
      <p>COLLEGE OF ENGINEERING POONJAR</p>
      <p>Managed by IHRD, Govt. of Kerala</p>
      <p>Poonjar Thekkekara P.O. Kottayam Dist. PIN 686 582</p>
      <p>Academic Year: ${academicYear}</p>
    </div>
  </div>

   <table class="print-table">
  
    <tr>
      <td colspan="2" style="font-weight:bold;">Admission No: ${studentDetails.admissionNumber}</td>
      <td colspan="2" style="text-align: left;">Submission Date: ${formatDate(studentDetails.submissionDate)}</td>
    </tr>
    <tr>
      <td>Admission Type</td>
      <td>${studentDetails.admissionType}</td>
      <td>Allotment Category</td>
      <td>${studentDetails.allotmentCategory}</td>
    </tr>
    <tr>
      <td>Fee Category</td>
      <td>${studentDetails.feeCategory}</td>
      <td>Course</td>
      <td>${studentDetails.course}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: center; font-weight: bold;">Student Details</td>
    </tr>
    <tr>
      <td>Name</td>
      <td>${studentDetails.name}</td>
      <td>Address</td>
      <td>${studentDetails.address}</td>
    </tr>
    <tr>
      <td>Permanent Address</td>
      <td>${studentDetails.permanentAddress ?? "Nil"}</td>
      <td>Pin Code</td>
      <td>${studentDetails.pincode}</td>
    </tr>
    <tr>
      <td>Religion</td>
      <td>${studentDetails.religion}</td>
      <td>Community</td>
      <td>${studentDetails.community}</td>
    </tr>
    <tr>
      <td>Gender</td>
      <td>${studentDetails.gender}</td>
      <td>Date of Birth</td>
      <td>${formatDate(studentDetails.dateOfBirth)}</td>
    </tr>
    <tr>
      <td>Blood Group</td>
      <td>${studentDetails.bloodGroup}</td>
      <td>Mobile No</td>
      <td>${studentDetails.mobileNo}</td>
    </tr>
    <tr>
      <td>WhatsApp No</td>
      <td>${studentDetails.whatsappNo}</td>
      <td>Email</td>
      <td>${studentDetails.email}</td>
    </tr>
    <tr>
      <td>Aadhar No</td>
      <td>${studentDetails.aadharNo}</td>
      <td>Nativity</td>
      <td>${studentDetails.nativity}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: center; font-weight: bold;">Entrance Exam Details</td>
    </tr>
    <tr>
      <td>Exam Name</td>
      <td>${studentDetails.entranceExam}</td>
      <td>Roll No</td>
      <td>${studentDetails.entranceRollNo}</td>
    </tr>
    <tr>
      <td>Rank</td>
      <td>${studentDetails.entranceRank}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: center; font-weight: bold;">Qualifying Examination Details</td>
    </tr>
    <tr>
      <td>Qualification</td>
      <td>${studentDetails.qualify?.exam ?? "Nil"}</td>
      <td>Exam Board</td>
      <td>${studentDetails.qualify?.board}</td>
    </tr>
    <tr>
      <td>Institution Name</td>
      <td>${studentDetails.qualify?.institution}</td>
      <td>Register No</td>
      <td>${studentDetails.qualify?.regNo}</td>
    </tr>
    <tr>
      <td>Exam Month and Year</td>
      <td>${studentDetails.qualify?.examMonthYear}</td>
      <td>Percentage</td>
      <td>${studentDetails.qualify?.percentage}</td>
    </tr>
    <tr>
      <td>CGPA</td>
      <td>${studentDetails.qualify?.cgpa ?? "Nil"}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: center; font-weight: bold;">Plus Two Mark Details</td>
    </tr>
    <tr>
      <td>Plus Two Board</td>
      <td>${studentDetails.marks?.boardType ?? "Nil"}</td>
      <td>Physics</td>
      <td>${studentDetails.marks?.physics ?? "Nil"}</td>
    </tr>
    <tr>
      <td>Chemistry</td>
      <td>${studentDetails.marks?.chemistry ?? "Nil"}</td>
      <td>Maths</td>
      <td>${studentDetails.marks?.maths ?? "Nil"}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: center; font-weight: bold;">Parents Details</td>
    </tr>
    <tr>
      <td>Father's Name</td>
      <td>${studentDetails.parentDetails?.fatherName ?? "Nil"}</td>
      <td>Mother's Name</td>
      <td>${studentDetails.parentDetails?.motherName ?? "Nil"}</td>
   
    </tr>
    <tr>
      <td>Mobile No</td>
      <td>${studentDetails.parentDetails?.fatherMobileNo ?? "Nil"}</td>
      <td>Mobile No</td>
      <td>${studentDetails.parentDetails?.motherMobileNo ?? "Nil"}</td>
    </tr>
    <tr>
      <td>Occupation</td>
      <td>${studentDetails.parentDetails?.fatherOccupation ?? "Nil"}</td>
      <td>Occupation</td>
      <td>${studentDetails.parentDetails?.motherOccupation ?? "Nil"}</td>
    
     
    </tr>
    <tr>
      <td>Annual Income</td>
      <td>${studentDetails.annualIncome}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: center; font-weight: bold;">Bank Account Details</td>
    </tr>
    <tr>
      <td>Bank Name</td>
      <td>${studentDetails.bankDetails.bankName ?? "Nil"}</td>
      <td>Branch</td>
      <td>${studentDetails.bankDetails.branch ?? "Nil"}</td>
    </tr>
    <tr>
      <td>Account No</td>
      <td>${studentDetails.bankDetails.accountNo ?? "Nil"}</td>
      <td>IFSC Code</td>
      <td>${studentDetails.bankDetails.ifscCode ?? "Nil"}</td>
    </tr>
    <tr>
      <td colspan="4" style="text-align: center; font-weight: bold;">Achievements</td>
    </tr>
   
      <tr>
        <td>Arts</td>
        <td>${studentDetails.achievements.arts ?? "Nil"}</td>
        <td>Sports</td>
        <td>${studentDetails.achievements.sports ?? "Nil"}</td>
      </tr>
      <tr>
        <td>Other</td>
      <td>${studentDetails.achievements.other ?? "Nil"}</td>
      </tr>
    
      <tr>
        <td colspan="4" style="text-align: center; font-weight: bold;">Certificates Provided</td>
      </tr>
      <tr>
        <td>Allotment Memo</td>
        <td>${studentDetails.certificates.allotmentmemo ? "Yes" : "No"}</td>
        <td>10th Certificate</td>
        <td>${studentDetails.certificates.tenth ? "Yes" : "No"}</td>
       
      </tr>
      <tr>
        <td>12th Certificate</td>
        <td>${studentDetails.certificates.plusTwo ? "Yes" : "No"}</td>
        <td>TC and Conduct Certificate</td>
        <td>${studentDetails.certificates.tcandconduct ? "Yes" : "No"}</td>
      </tr>
      </tr>
      <tr>
        <td>Data Sheet</td>
        <td>${studentDetails.certificates.DataSheet ? "Yes" : "No"}</td>
        <td>Physical Fitness</td>
        <td>${studentDetails.certificates.physicalfitness ? "Yes" : "No"}</td>
      </tr>
    <tr>  
       <td>passportsize Photo (2 Nos)</td>
    <td>${studentDetails.certificates.passportsizephoto ? "Yes" : "No"}</td>
   <td>Income Certificate</td>
    
   <td>${studentDetails.certificates.incomecertificates ? "Yes" : "No"}</td>
   </tr>
   <tr> 
   <td>Community Certificate</td>
    <td> ${studentDetails.certificates.communitycertificate ? "Yes" : "No"}</td>
   <td>caste Certificate</td>
    <td>${studentDetails.certificates.castecertificates ? "Yes" : "No"}</td>
   </tr>
   <tr> 
    <td> Copy Of Aadhaar Card</td>
    <td>${studentDetails.certificates.aadhar ? "Yes" : "No"}</td>
    <td> Other Certificates</td>
    <td>${studentDetails.certificates.other ? "Yes" : "No"}</td>
    </tr>

  </table>


 

             <div class="declaration">
    <p class="heading">Remarks:</p>
<br/>
    
    
<p class="content">.............................................................................................................................................................................................................................................................................................................................................................................</p>
   <br/>
<p class="content">.............................................................................................................................................................................................................................................................................................................................................................................  </p>
      
    <br/><p class="content">.............................................................................................................................................................................................................................................................................................................................................................................  </p>
 <br/>
 <br/>
    
  </div>
  <div class="signature">
      <div class="left">
        <p><strong>Name:</strong> ...........................................</p>
        <p><strong>Signature:</strong> ...........................................</p>
      </div>
      <div class="right">
        <p><strong>Place:</strong>Poonjar</p>
        <p><strong>Date:</strong>${getTodaysDate()}</p>
        <p>Principal</p>
      </div>
    </div>
  </div>
            <button class="hide-on-print" onclick="window.print()">Print</button>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error("Error generating print preview:", error);
    }
  };


  const handleEdit = (student) => {
    setFormData({
      ...initialFormData,
      ...student,
      qualify: {
        exam: student.qualify.exam || "",
        board: student.qualify.board || "",
        regNo: student.qualify.regNo || "",
        examMonthYear: student.qualify.examMonthYear || "",
        percentage: student.qualify.percentage || "",
        cgpa: student.qualify.cgpa || "",
        institution: student.qualify.institution || "",
      },
      parentDetails: {
        fatherName: student.parentDetails.fatherName || "",
        fatherOccupation: student.parentDetails.fatherOccupation || "",
        fatherMobileNo: student.parentDetails.fatherMobileNo || "",
        motherName: student.parentDetails.motherName || "",
        motherOccupation: student.parentDetails.motherOccupation || "",
        motherMobileNo: student.parentDetails.motherMobileNo || "",
      },
      bankDetails: {
        bankName: student.bankDetails.bankName || "",
        branch: student.bankDetails.branch || "",
        accountNo: student.bankDetails.accountNo || "",
        ifscCode: student.bankDetails.ifscCode || "",
      },
      achievements: {
        arts: student.achievements.arts || "",
        sports: student.achievements.sports || "",
        other: student.achievements.other || "",
      },
      marks: {
        boardType: student.marks.boardType,
        physics: student.marks.physics,
        chemistry: student.marks.chemistry,
        maths: student.marks.maths,
      },
    });
    setStudentId(student._id);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };
  const handleAluminCourseChange = (e) => {
    setSelectCourse(e.target.value);
  };
  const handleAlumniYearChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedAlumniYear(selectedValue);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${baseurl}/api/updateStudent/${studentId}`, formData);
      setIsSuccess(true);
      setEditMode(false);
      const response = await axios.get(`${baseurl}/api/approvedStudents`);
      setApprovedStudents(
        response.data.filter(
          (student) =>
            student.admissionNumber.split("/")[1] ===
            new Date().getFullYear().toString().slice(-2)
        )
      );
    } catch (error) {
      console.error("Error updating student details:", error);
    }
  };

  return (
    <div>
      <OfficerNavbar />
      <div className="student-display-container">
        {!editMode ? (
          <div>
            <button onClick={() => setShowAlumni(!showAlumni)}>
              {showAlumni ? "Show Approved Students" : "Show Alumni"}
            </button>
            {showAlumni ? (
              <div>
                <div className="filter-container">
                  <label className="filter-label">Filter by Course:</label>
                  <select
                    className="filter-dropdown"
                    onChange={handleAluminCourseChange}
                    value={selectCourse}
                  >
                    <option value="">All Courses</option>
                    <option value="B.Tech CSE">BTech CSE</option>
                    <option value="B.Tech ECE">BTech ECE</option>
                    <option value="BBA">BBA</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    {/* Add more courses as needed */}
                  </select>
                  &nbsp;
                  <label htmlFor="alumniYearSelect">Select Alumni Year: </label>
                  <select
                    id="alumniYearSelect"
                    value={selectedAlumniYear}
                    onChange={handleAlumniYearChange}
                  >
                    <option value="">All</option>
                    {alumniYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <h2>Alumni</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Admission Number</th>
                      <th>Course</th>
                      <th>MobileNo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumni.map((student) => (
                      <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.admissionNumber}</td>
                        <td>{student.course}</td>
                        <td>{student.mobileNo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>
                <h2>Approved Students</h2>
                <div className="filter-container">
                  <label className="filter-label">Filter by Course:</label>
                  <select
                    className="filter-dropdown"
                    onChange={handleCourseChange}
                    value={selectedCourse}
                  >
                    <option value="">All Courses</option>
                    <option value="B.Tech CSE">BTech CSE</option>
                    <option value="B.Tech ECE">BTech ECE</option>
                    <option value="BBA">BBA</option>
                    <option value="MCA">MCA</option>
                    <option value="BCA">BCA</option>
                    {/* Add more courses as needed */}
                  </select>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Admission Number</th>
                      <th>Course</th>
                      <th>MobileNo</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedStudents.map((student) => (
                      <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.admissionNumber}</td>
                        <td>{student.course}</td>
                        <td>{student.mobileNo}</td>
                        <td>
                          <button onClick={() => handleEdit(student)}>
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handlePrintPreview(student._id, student.photo)
                            }
                          >
                            Print
                          </button>
                          <button className="delete-button" onClick={() => handleDelete(student._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2>Edit Student Details</h2>
            <button onClick={() => setEditMode(false)}>
              Back to Student Details
            </button>
            <div className="data-entry-container">
              <div className="page-title">Admission Form</div>
              <hr className="divider"></hr>
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Fee Category:</label>
                  <select
                    name="feeCategory"
                    value={formData.feeCategory}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Fee Category</option>
                    <option value="Merit Lower Fee">Merit Lower Fee</option>
                    <option value="Merit Higher Fee">Merit Higher Fee</option>
                    <option value=" Fee wavier">FW</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="required"> Course:</label>
                  <select
                    value={formData.course}
                    onChange={(e) =>
                      setFormData({ ...formData, course: e.target.value })
                    }
                  >
                    <option value="">Select Course</option>
                    <option value="B.Tech CSE">B.Tech CSE</option>
                    <option value="B.Tech ECE">B.Tech ECE</option>
                    <option value="BBA">BBA</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    {/* Add other courses as needed */}
                  </select>
                </div>
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
                  <label> Permanent Address:</label>
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
                <div className="row">
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
                </div>
                <div className="row">
                  <div className="form-group">
                    <label>Gender:</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                      <option value="Prefer to not say">
                        Prefer to not say
                      </option>
                    </select>
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
                </div>
                <div className="form-group">
                  <label>Date Of Birth:</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formatDateForInput(formData.dateOfBirth)}
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
                <div className="parent-details-row">
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
                </div>
                <div className="box">
                  <h4>Qualifying Examination Details</h4>
                  <div className="parent-details-row">
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
                      />
                    </div>
                  </div>
                </div>

                {formData.course === "B.Tech CSE" ||
                formData.course === "B.Tech ECE" ? (
                  <>
                    <div className="form-group">
                      <div className="box">
                        <h4>Plus Two Mark</h4>
                        <label className="required">
                          (Please Enter Plus Two Mark Only)
                        </label>
                        <div className="radio-group-row">
                          <label>
                            <input
                              type="radio"
                              name="marks.boardType"
                              value="State"
                              checked={formData.marks.boardType === "State"}
                              onChange={handleInputChange}
                            />
                            <span></span> State
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="marks.boardType"
                              value="CBSE"
                              checked={formData.marks.boardType === "CBSE"}
                              onChange={handleInputChange}
                            />
                            <span></span> CBSE
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="marks.boardType"
                              value="ICSE"
                              checked={formData.marks.boardType === "ICSE"}
                              onChange={handleInputChange}
                            />
                            <span></span> ICSE
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="marks.boardType"
                              value="Others"
                              checked={formData.marks.boardType === "Others"}
                              onChange={handleInputChange}
                            />
                            <span></span> Others
                          </label>
                        </div>

                        <div className="row">
                          <label>
                            Physics Marks:
                            <input
                              type="number"
                              name="marks.physics"
                              value={formData.marks.physics}
                              onChange={handleInputChange}
                            />
                          </label>

                          <label>
                            Chemistry Marks:
                            <input
                              type="number"
                              name="marks.chemistry"
                              value={formData.marks.chemistry}
                              onChange={handleInputChange}
                            />
                          </label>

                          <label>
                            Maths Marks:
                            <input
                              type="number"
                              name="marks.maths"
                              value={formData.marks.maths}
                              onChange={handleInputChange}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                <div className="box">
                  <h4>Parent Details</h4>
                  <div className="parent-details-row">
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
                </div>
                <div className="row">
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
                </div>
                <div className="box">
                  <h4>Bank Details</h4>
                  <div className="parent-details-row">
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
                </div>
                <div className="box">
                  <h4>Achievements</h4>
                  <div className="row">
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
                </div>
                <div className="button-container">
                  <button className="submit-button" onClick={handleSave}>
                    Save
                  </button>
                  <button className="clear-button" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isSuccess && <p>Update successful!</p>}
      </div>
    </div>
  );
};

export default StudentListOfficer;
