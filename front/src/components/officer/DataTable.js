import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./OfficerNavbar";
import "./DataTable.css";
import { baseurl } from "../../url";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [lastAdmissionNumbers, setLastAdmissionNumbers] = useState({});
  const [editableNumbers, setEditableNumbers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    admissionNumber: "",
    feeCategory: "",
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
    certificates: {
      tenth: false,
      plusTwo: false,
      tcandconduct: false,
      allotmentmemo: false,
      Datasheet: false,
      physicalfitness: false,
      passportsizephoto: false,
      incomecertificates: false,
      communitycertificate: false,
      castecertificate: false,
      aadhaar: false,
      other: false,
    },

    annualIncome: "",
    nativity: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [studentId, setStudentId] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${baseurl}/api/studentAdmission`);
        const sortedStudents = response.data.sort(
          (a, b) => new Date(b.submissionDate) - new Date(a.submissionDate)
        );
        setStudents(sortedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length === 0) {
      return; // Exit early if there are no students
    }

    const fetchLastAdmissionNumbers = async () => {
      try {
        const courses = ["B.Tech CSE", "B.Tech ECE", "BBA", "BCA", "MCA"];
        const response = await axios.post(
          `${baseurl}/api/lastAdmissionNumbers`,
          { courses }
        );

        // Extract and format admission numbers
        const numbers = response.data.reduce(
          (acc, { course, lastAdmissionNumber }) => {
            acc[course] = lastAdmissionNumber;
            return acc;
          },
          {}
        );

        // Utility function to increment admission number and format with leading zeros
        const incrementAdmissionNumber = (admissionNumber) => {
          const [currentNumber, year] = admissionNumber.split("/");
          const incrementedNumber = (parseInt(currentNumber, 10) + 1)
            .toString()
            .padStart(2, "0");
          return `${incrementedNumber}/${year}`;
        };

        // Variables to store last admission numbers for BTech CSE and BTech ECE
        let btechCseNumber = numbers["B.Tech CSE"] || "00/00";
        let btechEceNumber = numbers["B.Tech ECE"] || "00/00";

        // Parse admission numbers to compare
        const parseAdmissionNumber = (admissionNumber) => {
          const [currentNumber, year] = admissionNumber.split("/");
          return {
            number: parseInt(currentNumber, 10),
            year: year,
          };
        };

        const btechCseParsed = parseAdmissionNumber(btechCseNumber);
        const btechEceParsed = parseAdmissionNumber(btechEceNumber);

        // Determine the higher number for BTech CSE and BTech ECE
        const maxAdmissionNumber = Math.max(
          btechCseParsed.number,
          btechEceParsed.number
        );

        // Set the same next admission number for both BTech CSE and BTech ECE
        const nextAdmissionNumber = incrementAdmissionNumber(
          maxAdmissionNumber.toString().padStart(2, "0") +
            "/" +
            btechCseParsed.year
        );

        // Handle admission numbers for each course
        for (const course of courses) {
          if (course === "B.Tech CSE" || course === "B.Tech ECE") {
            // For B.Tech CSE and BTech ECE, use the common next admission number
            numbers[course] = nextAdmissionNumber;
          } else {
            // For other courses, increment based on the specific course's last admission number
            numbers[course] = incrementAdmissionNumber(
              numbers[course] || "00/00"
            );
          }
        }

        setLastAdmissionNumbers(numbers);
        setEditableNumbers(numbers); // Initialize editable numbers
        setLoading(false);
      } catch (error) {
        console.error("Error fetching last admission numbers:", error);
        setError("Failed to fetch admission numbers");
        setLoading(false);
      }
    };

    fetchLastAdmissionNumbers();
  }, [students]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    const { name, value,checked, type } = e.target;

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
    } else if (name.includes("marks")) {
      const [, subField] = name.split(".");
      setFormData({
        ...formData,
        marks: {
          ...formData.marks,
          [subField]: value,
        },
      });
    }  else if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        certificates: {
          ...prevFormData.certificates,
          [name]: checked,
        },
      }));
    }
    else if (name.startsWith("achievements")) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${baseurl}/api/datatable/updateStudent/${studentId}`,
        formData
      );
      setIsSuccess(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating student details:", error);
    }
  };

  const handleApprove = async (studentId, course) => {
    const confirm = window.confirm("Are you sure you want to Approve this student?");
    if (!confirm) return;
  
    try {
      // Retrieve the admission number to send
      const admissionNumber =
        editableNumbers[course] || lastAdmissionNumbers[course];

      // Send the admission number with the API request
      await axios.post(`${baseurl}/api/approve/${studentId}`, {
        admissionNumber,
      });
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );
      alert("Student Student Approved  successfully.");
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  const handleDecline = async (studentId) => {
    const confirm = window.confirm("Are you sure you want to decline this student?");
    if (!confirm) return;
  
    try {
      await axios.post(`${baseurl}/api/decline/${studentId}`);
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );
      alert("Student declined successfully.");
    } catch (error) {
      console.error("Error declining student:", error);
      alert("Error declining student.");
    }
  };
  

  const handlePrintPreview = async (_id, photoPath) => {
    try {
      const photoUrl = `${baseurl}/api/image/${encodeURIComponent(photoPath)}`;
      const response = await axios.get(`${baseurl}/api/studentDetails/${_id}`);
    
      const studentDetails = response.data.studentDetails;
      const feeDetails = response.data.studentDetails.feeDetails;
    
     

      if (!studentDetails || !studentDetails.parentDetails) {
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
      const calculateTotalFee = () => {
        return (
          (parseFloat(feeDetails.admissionFee) || 0) +
          (parseFloat(feeDetails.tuitionFee) || 0) +
          (parseFloat(feeDetails.groupInsuranceandidCard) || 0) +
          (parseFloat(feeDetails.ktuSportsArts) || 0) +
          (parseFloat(feeDetails.ktuAdminFee) || 0) +
          (parseFloat(feeDetails.ktuAffiliationFee) || 0) +
          (parseFloat(feeDetails.cautionDeposit) || 0) +
          (parseFloat(feeDetails.pta) || 0) +
          (parseFloat(feeDetails.busFund) || 0) +
          (parseFloat(feeDetails.trainingPlacement) || 0)
        );
      };
    
      
     
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
      const showFeeDetails = studentDetails.feeCategory === "Merit Lower Fee" || studentDetails.feeCategory === "Merit Higher Fee";
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${studentDetails.name}'s Details</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
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
    .centered-table {
      width: 80%; /* Adjust the width of the table as needed */
      margin-left: auto;
      margin-right: auto;
      border-collapse: collapse; /* Optional: for cleaner table borders */
      font-size: 12pt; /* Adjust font size */
    }
    .centered-table td {
      padding: 10px; /* Adjust padding */
    }
    .first-col {
      width: 60%; /* Adjust the width percentage of the first column */
    }
    .second-col {
      width: 40%;
      text-align: center; /* Adjust the width percentage of the second column */
    }
   .cutting-symbol {
  display: inline-block;
  margin-right: 10px; /* Space between the icon and the text */
  vertical-align: middle; /* Align with the middle of the text */
}

.cutting-symbol i {
  font-size: 24px; /* Adjust the size as needed */
  color: #000; /* Change color if needed */
}

.dotted-line {
  display: inline-block;
  width: 100%; /* Adjust width as needed */
  border-bottom: 1px dotted black; /* Style for the dotted line */
  vertical-align: middle; /* Align with the middle of the icon */
}
    @media print {
      .hide-on-print {
        display: none;
      }
      .page-break {
        page-break-before: always;
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
      <td colspan="2" style="font-weight:bold;">Admission No: ${studentDetails.admissionId}</td>
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
    <p class="heading">Declaration of Student:</p>
     <br/>
    <p class="content">
      I .......................................................................... hereby undertake on being admitted to the college to abide by the rules and regulations of the college during the course of my study. I will not engage in any undesirable activity either inside or outside the college that will adversely affect orderly working, discipline, and the regulations of the college.
    </p>
    <br><br>
    
    <p><strong>Name:</strong> ...........................................</p>
    <p><strong>Signature:</strong> ...........................................</p>
   
       <br>  <br>   <br>
    <p class="heading">Declaration of Parent:</p>
     <br/>
    <p class="content">
      I .................................................................................. hereby declare that my son / daughter / ward ................................................ will abide by the rules and regulations of this institution.
    </p>

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
    <br/>
    <br>
       <p><strong>Verifing Officer:</strong> ...........................................</p>
       <br>
       <p><strong>Signature:</strong> ...........................................</p>
  </div>
   <div class="page-break"></div>


   <table class="print-table centered-table">
   ${showFeeDetails ? `
   <tr style="padding-top: 20px; padding-bottom: 20px;">
     <td colspan="2" style="text-align: center; font-weight: bold;">
       ${studentDetails.course} ${studentDetails.feeCategory} Structure
     </td>
   </tr>
 
   <tr>
     <td class="first-col">Admission Fee (1st Year Only)</td>
     <td class="second-col">${feeDetails.admissionFee}</td>
   </tr>
   <tr>
     <td class="first-col">Tuition Fee(per Semester)</td>
     <td class="second-col">${feeDetails.tuitionFee}</td>
   </tr>
   <tr>
     <td class="first-col">Group Insurance Fee and Id Card</td>
     <td class="second-col">${feeDetails.groupInsuranceandidCard}</td>
   </tr>
   <tr>
     <td class="first-col">KTU Sports and Arts Fee</td>
     <td class="second-col">${feeDetails.ktuSportsArts}</td>
   </tr>
   <tr>
     <td class="first-col">KTU Administration Fee (1st year only)</td>
     <td class="second-col">${feeDetails.ktuAdminFee}</td>
   </tr>
   <tr>
     <td class="first-col">KTU Affiliation Fee (1st year only)</td>
     <td class="second-col">${feeDetails.ktuAffiliationFee}</td>
   </tr>
   <tr>
     <td class="first-col">Caution Deposit (refundable) (1st year only)</td>
     <td class="second-col">${feeDetails.cautionDeposit}</td>
   </tr>
   <tr>
     <td class="first-col">PTA (One Time)</td>
     <td class="second-col">${feeDetails.pta}</td>
   </tr>
   <tr>
     <td class="first-col">Bus Fund (One Time)</td>
     <td class="second-col">${feeDetails.busFund}</td>
   </tr>
   <tr>
     <td class="first-col">Training and Placement Cell (One Time)</td>
     <td class="second-col">${feeDetails.trainingPlacement}</td>
   </tr>
     <td class="first-col">Total</td>
     <td class="second-col">${calculateTotalFee()}</td>
   </tr>
 </table>
   <p class="content"style="text-align: center;">
   Tution Fee ${feeDetails.tuitionFee}/- to be remitted in the start of 2nd semester
   </p>
 <br/>
      <br/>
       <br/>
      <br/> <br/>
      <br/> <br/>
      <br/>
<p class="content">
  <span class="cutting-symbol">
    <i class="fas fa-cut"></i> <!-- Font Awesome scissor icon -->
  </span>
  <span class="dotted-line"></span>
</p>
       <br/>
      <br/> <br/>
      <br/> <br/>
      <br/> <br/>
      <br/>




 <table class="print-table centered-table">
  
   <tr style="padding-top: 20px; padding-bottom: 20px;">
     <td colspan="2" style="text-align: center; font-weight: bold;">
       ${studentDetails.course} ${studentDetails.feeCategory} Structure
     </td>
   </tr>
 
   <tr>
     <td class="first-col">Admission Fee (1st Year Only)</td>
     <td class="second-col">${feeDetails.admissionFee}</td>
   </tr>
   <tr>
     <td class="first-col">Tuition Fee</td>
     <td class="second-col">${feeDetails.tuitionFee}</td>
   </tr>
   <tr>
     <td class="first-col">Group Insurance Fee and Id Card</td>
     <td class="second-col">${feeDetails.groupInsuranceandidCard}</td>
   </tr>
   <tr>
     <td class="first-col">KTU Sports and Arts Fee</td>
     <td class="second-col">${feeDetails.ktuSportsArts}</td>
   </tr>
   <tr>
     <td class="first-col">KTU Administration Fee (1st year only)</td>
     <td class="second-col">${feeDetails.ktuAdminFee}</td>
   </tr>
   <tr>
     <td class="first-col">KTU Affiliation Fee (1st year only)</td>
     <td class="second-col">${feeDetails.ktuAffiliationFee}</td>
   </tr>
   <tr>
     <td class="first-col">Caution Deposit (refundable) (1st year only)</td>
     <td class="second-col">${feeDetails.cautionDeposit}</td>
   </tr>
   <tr>
     <td class="first-col">PTA (One Time)</td>
     <td class="second-col">${feeDetails.pta}</td>
   </tr>
   <tr>
     <td class="first-col">Bus Fund (One Time)</td>
     <td class="second-col">${feeDetails.busFund}</td>
   </tr>
   <tr>
     <td class="first-col">Training and Placement Cell (One Time)</td>
     <td class="second-col">${feeDetails.trainingPlacement}</td>
   </tr>
      <td class="first-col">Total</td>
     <td class="second-col">${calculateTotalFee()}</td>
   </tr>
 </table>
    <p class="content"style="text-align: center;">
   Tution Fee ${feeDetails.tuitionFee}/- to be remitted in the start of 2nd semester
   </p>
      ` : `
  
    `}
 
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
    const formattedDateOfBirth = new Date(student.dateOfBirth)
      .toISOString()
      .split("T")[0];
    setFormData({
      ...formData,

      feeCategory: student.feeCategory,
      name: student.name,
      address: student.address,
      permanentAddress: student.permanentAddress,
      pincode: student.pincode,
      religion: student.religion,
      community: student.community,
      gender: student.gender,
      dateOfBirth: formattedDateOfBirth,
      bloodGroup: student.bloodGroup,
      mobileNo: student.mobileNo,
      whatsappNo: student.whatsappNo,
      email: student.email,
      entranceExam: student.entranceExam,
      entranceRollNo: student.entranceRollNo,
      entranceRank: student.entranceRank,
      aadharNo: student.aadharNo,
      course: student.course,
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
      certificates: {
        tenth: student.certificates.tenth,
        plusTwo: student.certificates.plusTwo,
        tcandconduct: student.certificates.tcandconduct,
        allotmentmemo:student.certificates.allotmentmemo,
        Datasheet:student.certificates.datasheet,
        physicalfitness: student.certificates.physicalfitness,
        passportsizephoto:student.certificates.passportsizephoto,
        incomecertificates: student.certificates.incomecertificates,
        communitycertificate: student.certificates.communitycert,
        castecertificate: student.certificates.castecertificate,
        aadhaar:  student.certificates.aadhaar,
        other: student.certificates.other,
      },


      annualIncome: student.annualIncome || "",
      nativity: student.nativity || "",
    });
    setStudentId(student._id);
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      await axios.put(`${baseurl}/api/updateStudent/${studentId}`, formData);
      setIsSuccess(true);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating student details:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="data-table-container">
        {!editMode ? (
          <div>
            <h1>New Admission Student List</h1>
            {students.length > 0 ? (
              <div>
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Admission ID</th>
                      <th>Course</th>
                      <th>Submission Date</th>
                      <th>Next Admission Number</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>{student.name}</td>
                        <td>{student.admissionId}</td>
                        <td>{student.course}</td>
                        <td>
                          {student.submissionDate
                            ? new Date(
                                student.submissionDate
                              ).toLocaleDateString()
                            : "Not Provided"}
                        </td>
                        <td>
                          <span>
                            {editableNumbers[student.course] ||
                              lastAdmissionNumbers[student.course]}
                          </span>
                        </td>

                        <td>
                        <button
                            className="print-preview-btn"
                            onClick={() =>
                              handlePrintPreview(student._id, student.photo)
                            }
                          >
                            
                            Print Preview
                          </button>
                          <button
                          className="Edit-btn"
                          onClick={() => handleEdit(student)}>
                            Edit
                          </button>
                          <button
                            className="approve-btn"
                            onClick={() => handleApprove(student._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="decline-btn"
                            onClick={() => handleDecline(student._id)}
                          >
                            Decline
                          </button>
                          
                       
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-admissions-message">
                <span className="emoji">📚</span>
                <h2>No New Admissions</h2>
                <p className="description">
                  Currently, there are no new admissions to display. Please
                  check back later.
                </p>
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
              <hr class="divider"></hr>
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
                        required
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
                <div className="checkbox-container">
            <label className="required">Submitted Certificates</label>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="tenth"
                name="tenth"
                checked={formData.certificates.tenth}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="tenth">10th Certificate</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="plusTwo"
                name="plusTwo"
                checked={formData.certificates.plusTwo}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="plusTwo">12th Certificate</label>
            </div>

            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="tcandconduct"
                name="tcandconduct"
                checked={formData.certificates.tcandconduct}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="tcandconduct">TC and Conduct Certificate</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="allotmentmemo"
                name="allotmentmemo"
                checked={formData.certificates.allotmentmemo}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="allotmentmemo">Allotment Memo</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="Datasheet"
                name="Datasheet"
                checked={formData.certificates.Datasheet}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="Datasheet">Data Sheet</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="physicalfitness"
                name="physicalfitness"
                checked={formData.certificates.physicalfitness}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="physicalfitness">physicalfitness</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="aadhaar"
                name="aadhaar"
                checked={formData.certificates.aadhaar}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="aadhaar">Copy of Aadhaar Card</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="passportsizephoto"
                name="passportsizephoto"
                checked={formData.certificates.passportsizephoto}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="passportsizephoto">
                Passportsize Photo(2 Nos)
              </label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="incomecertificates"
                name="incomecertificates"
                checked={formData.certificates.incomecertificates}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="incomecertificates">Income Certificate</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="communitycertificate"
                name="communitycertificate"
                checked={formData.certificates.communitycertificate}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="communitycertificate">
                Community Certificate
              </label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="castecertificate"
                name="castecertificate"
                checked={formData.certificates.castecertificate}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="castecertificate">Caste Certificate</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="other"
                name="other"
                checked={formData.certificates.other}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="other">Other</label>
            </div>
          </div>
                <div className="button-container">
                  <button class="submit-button" onClick={handleSave}>
                    Save
                  </button>
                  <button class="clear-button" onClick={handleCancel}>
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

export default StudentList;
