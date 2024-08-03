import React, { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "./TutorNavbar";
import "./tutorstudentlist.css";

const TutorUpdates = () => {
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [semester, setSemester] = useState("");

  const [registerNumberPrefix, setRegisterNumberPrefix] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    semester: "",
    academicYear: "",
    admissionNumber: "",
    dateOfBirth: "",
    address: "",
    email: "",
    mobileNo: "",
    collegemail: "",
    RegisterNo: "",
    lab: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const tutorclass = localStorage.getItem("tutorclass");
    const academicYear = localStorage.getItem("academicYear");
    if (tutorclass && academicYear) {
      fetchStudents(tutorclass, academicYear);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchStudents = async (tutorclass, academicYear) => {
    try {
      const response = await axios.get(
        `/api/students/tutor/${tutorclass}/${academicYear}`
      );
      const sortedStudents = response.data.sort((a, b) =>
        a.RollNo.localeCompare(b.RollNo)
      );
      setStudents(sortedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      setErrorMessage("Error fetching students");
    }
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  const handleSemesterSubmit = async (e) => {
    e.preventDefault();
    if (!semester) {
      setErrorMessage("Please enter a semester to update");
      return;
    }

    const tutorclass = localStorage.getItem("tutorclass");
    const academicYear = localStorage.getItem("academicYear");

    try {
      await axios.put(
        `/api/students/semester/${tutorclass}/${academicYear}`,
        { semester }
      );
      fetchStudents(tutorclass, academicYear); // Refresh the list after updating
      setSemester(""); // Clear the semester field after successful update
      setSuccessMessage("All students' semesters updated successfully!");
    } catch (error) {
      console.error("Error updating student:", error);
      setErrorMessage("Error updating student");
    }
  };

  const handleRegisterNumberChange = (e) => {
    setRegisterNumberPrefix(e.target.value);
  };

  const handleRegisterNumberSubmit = async (e) => {
    e.preventDefault();
    if (!registerNumberPrefix) {
      setErrorMessage("Please enter a starting register number");
      return;
    }

    const tutorclass = localStorage.getItem("tutorclass");
    const academicYear = localStorage.getItem("academicYear");

    try {
      const updatedStudents = students.map((student, index) => {
        const registerNumber =
          registerNumberPrefix.slice(0, -3) +
          String(parseInt(registerNumberPrefix.slice(-3)) + index).padStart(
            3,
            "0"
          );
        return { ...student, RegisterNo: registerNumber };
      });

      await Promise.all(
        updatedStudents.map((student) =>
          axios.put(`/api/students/${student._id}`, student)
        )
      );

      fetchStudents(tutorclass, academicYear); // Refresh the list after updating
      setRegisterNumberPrefix(""); // Clear the register number prefix field after successful update
      setSuccessMessage("All students' register numbers updated successfully!");
    } catch (error) {
      console.error("Error updating student:", error);
      setErrorMessage("Error updating student");
    }
  };

  const handleAlphabeticalRollNumberAssignment = async () => {
    const tutorclass = localStorage.getItem("tutorclass");
    const academicYear = localStorage.getItem("academicYear");
  
    try {
      const rollNumberPrefix = "1"; // Set your register number prefix here
      await axios.put(
        `/api/students/roll-numbers/${encodeURIComponent(tutorclass)}/${academicYear}`,
        { rollNumberPrefix }
      );
  
      fetchStudents(tutorclass, academicYear); // Refresh the list after updating
      setSuccessMessage("Roll numbers assigned based on alphabetical order successfully!");
    } catch (error) {
      console.error("Error assigning roll numbers:", error);
      setErrorMessage("Error assigning roll numbers");
    }
  };
  
  
  const handleEdit = (student) => {
    setSelectedStudent(student._id);
    setFormData({
      id: student._id,
      RollNo: student.RollNo,
      name: student.name,
      semester: student.semester,
      academicYear: student.academicYear,
      admissionNumber: student.admissionNumber,
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : "",
      address: student.address,
      email: student.email,
      mobileNo: student.mobileNo,
      collegemail: student.collegemail,
      RegisterNo: student.RegisterNo,
      lab: student.lab,
    });
  };

  const handleLabAssignment = async () => {
    const tutorclass = localStorage.getItem("tutorclass");
    const academicYear = localStorage.getItem("academicYear");

    try {
      await axios.put(
        `/api/students/lab-assignment/${encodeURIComponent(tutorclass)}/${encodeURIComponent(academicYear)}`
      );
      fetchStudents(tutorclass, academicYear); // Refresh the list after updating
      setSuccessMessage("Students' lab assignments updated successfully!");
    } catch (error) {
      console.error("Error updating lab assignments:", error);
      setErrorMessage("Error updating lab assignments");
    }
  };

  const handleEmailInitialization = async () => {
    const tutorclass = localStorage.getItem("tutorclass");
    const academicYear = localStorage.getItem("academicYear");

    try {
      const updatedStudents = students.map((student) => {
        const email = `${student.RegisterNo.toLowerCase()}@cep.ac.in`;
        return { ...student, collegemail: email };
      });

      await Promise.all(
        updatedStudents.map((student) =>
          axios.put(`/api/students/${student._id}`, student)
        )
      );

      fetchStudents(tutorclass, academicYear); // Refresh the list after updating
      setSuccessMessage("College emails initialized successfully!");
    } catch (error) {
      console.error("Error initializing college emails:", error);
      setErrorMessage("Error initializing college emails");
    }
  };

  const resetFormData = () => {
    setFormData({
      id: "",
      name: "",
      semester: "",
      academicYear: "",
      admissionNumber: "",
      dateOfBirth: "",
      address: "",
      email: "",
      mobileNo: "",
      collegemail: "",
      RegisterNo: "",
      lab: "",
    });
  };

  const handleCancel = () => {
    setSelectedStudent(null);
    resetFormData();
    setSuccessMessage("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { id, ...updateData } = formData;

    try {
      await axios.put(`/api/students/${id}`, updateData);
      setSuccessMessage("Student updated successfully!");
      fetchStudents(localStorage.getItem("tutorclass"), localStorage.getItem("academicYear")); // Refresh the list after updating
      setSelectedStudent(null);
      resetFormData();
    } catch (error) {
      console.error("Error updating student:", error);
      setErrorMessage("Error updating student");
    }
  };


  return (
    <>
    <div>
      <Navbar />

      <div className="student-list-container">
        <h1>Student Details</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="student-list">
          {/* Form to update all students' semester */}
          {/* Form to update all students' semester */}
<form onSubmit={handleSemesterSubmit} className="update-form">
  <label htmlFor="semester">Update Semester for All Students:</label>
  <input
    type="text"
    id="semester"
    value={semester}
    onChange={handleSemesterChange}
    placeholder="Enter Semester"
    required
  />
  <div className="button-container">
    <button type="submit">Update All Students</button>
  </div>
</form>

{/* Form to update all students' register number */}
<form onSubmit={handleRegisterNumberSubmit} className="update-form">
  <label htmlFor="registerNumberPrefix">Enter Starting Register Number:</label>
  <input
    type="text"
    id="registerNumberPrefix"
    value={registerNumberPrefix}
    onChange={handleRegisterNumberChange}
    placeholder="Enter Starting Register Number"
    required
  />
  <div className="button-container">
    <button type="submit">Update All Register Numbers</button>
  </div>
</form>

{/* Button to assign labs to students */}
<div className="button-container">
  <button onClick={handleLabAssignment}>Assign Labs to Students</button>
  <button onClick={handleEmailInitialization}>Initialize College Emails</button>
  <button onClick={handleAlphabeticalRollNumberAssignment}>Assign Roll Numbers </button>
</div>

          {/* Show the list of students only if no student is selected for editing */}
          {selectedStudent === null &&
            students.map((student) => (
              <div key={student._id} className="student-item">
                <p><strong>Roll No:</strong>{student.RollNo}</p>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Admission Number:</strong> {student.admissionNumber}</p>
                <p><strong>RegisterNo:</strong> {student.RegisterNo}</p>
                <p><strong>Semester:</strong> {student.semester}</p>
                <p><strong>AcademicYear:</strong> {student.academicYear}</p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {student.dateOfBirth ? formatDate(student.dateOfBirth) : ""}
                </p>
                <p><strong>Gender:</strong> {student.gender}</p>
                <p><strong>Address:</strong> {student.address}</p>
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.mobileNo}</p>
                <p><strong>College Email:</strong> {student.collegemail}</p>
                <p><strong>Lab:</strong> {student.lab}</p>
                <button onClick={() => handleEdit(student)}>Edit</button>
                <hr />
              </div>
            ))}

          {/* Show the form for editing only if a student is selected */}
          {selectedStudent !== null && (
            <form onSubmit={handleFormSubmit} className="student-form">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                required
              />
              <input
                type="text"
                name="admissionNumber"
                value={formData.admissionNumber}
                onChange={handleInputChange}
                placeholder="Admission Number"
                required
              />
              <input
                type="text"
                name="RegisterNo"
                value={formData.RegisterNo}
                onChange={handleInputChange}
                placeholder="Register Number"
              />
               <input
                type="text"
                name="RollNo"
                value={formData.RollNo}
                onChange={handleInputChange}
                placeholder="Roll No"
              />
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                placeholder="Semester"
                required
              />
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleInputChange}
                placeholder="Academic Year"
                required
              />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
                placeholder="Mobile No"
                required
              />
              <input
                type="text"
                name="collegemail"
                value={formData.collegemail}
                onChange={handleInputChange}
                placeholder="College Email"
                required
              />
        
               
                  <select
                      name="lab"
                      value={formData.lab}
                    onChange={handleInputChange}
                   
                  >
                    <option value="">Select Lab</option>
                    <option value="Lab 1">Lab 1</option>
                    <option value="Lab 2">Lab 2</option>
                  </select>
               
              <button type="submit">Update</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default TutorUpdates;
