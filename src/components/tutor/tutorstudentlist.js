import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from './TutorNavbar';
import './tutorstudentlist.css'; // Import your CSS file

function StudentDetailsPage() {
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [editedStudent, setEditedStudent] = useState(null); // To track the student being edited
  const [newEmail, setNewEmail] = useState('');

  // Define fetchStudents as a useCallback Hook to prevent unnecessary re-renders
  const fetchStudents = useCallback(async () => {
    try {
      // Adjust department names before sending the request
      const adjustedDepartment = adjustDepartmentName(department);
      
      const response = await axios.get(`/api/tutor?department=${adjustedDepartment}&academicYear=${academicYear}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, [department, academicYear]); // Include department and academicYear in the dependency array

  useEffect(() => {
    // Retrieve department and academic year from local storage
    const storedDepartment = localStorage.getItem('department');
    const storedAcademicYear = localStorage.getItem('academicYear');
    
    if (storedDepartment && storedAcademicYear) {
      setDepartment(storedDepartment);
      setAcademicYear(storedAcademicYear);
    }
  }, [department, academicYear]); // Include department and academicYear in the dependency array

  useEffect(() => {
    if (department && academicYear) {
      fetchStudents(); // Call fetchStudents here
    }
  }, [department, academicYear, fetchStudents]); // Include fetchStudents in the dependency array

  // Function to adjust department names
  const adjustDepartmentName = (dept) => {
    if (dept === 'CSE') {
      return 'computerScience';
    } else if (dept === 'ECE') {
      return 'electronicsAndCommunication';
    } else {
      return dept;
    }
  };

  // Function to handle editing of student details
  const handleEdit = (student) => {
    // Initialize emails array if it's not present
    const editedStudentData = { ...student };
    if (!editedStudentData.emails) {
      editedStudentData.emails = [];
    }
    setEditedStudent(editedStudentData); // Set the entire student object to be edited
  };

  // Function to handle updating semester, name, and adding new email to the student
  const handleSave = async () => {
    try {
      if (editedStudent) {
        // If the newEmail is not empty and not already present in editedStudent.emails, add it
        if (newEmail && !editedStudent.emails.includes(newEmail)) {
          // Send a POST request to add the new email
          await axios.post(`/api/students/${editedStudent._id}/emails`, { email: newEmail });
        }
        
        // Update the student details
        const updatedStudentResponse = await axios.put(`/api/students/${editedStudent._id}`, editedStudent);
        console.log('Student updated:', updatedStudentResponse.data);

        // Reset edited student and new email
        setEditedStudent(null);
        setNewEmail('');

        // Fetch updated student list
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating student and handling college email:', error);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="student-details-table-container">
        <table className="student-details-table">
          <thead>
            <tr>
              <th>Admission Number</th>
              <th>Name</th>
              <th>Semester</th>
              <th>Department</th>
              <th>Academic Year</th>
              <th>College Emails</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.admissionNumber}</td>
                <td>
                  {editedStudent && editedStudent._id === student._id ? (
                    <input 
                      type="text" 
                      value={editedStudent.name} 
                      onChange={(e) => setEditedStudent({ ...editedStudent, name: e.target.value })} 
                    />
                  ) : (
                    student.name
                  )}
                </td>
                <td>
                  {editedStudent && editedStudent._id === student._id ? (
                    <input 
                      type="number" 
                      value={editedStudent.semester} 
                      onChange={(e) => setEditedStudent({ ...editedStudent, semester: e.target.value })} 
                    />
                  ) : (
                    student.semester
                  )}
                </td>
                <td>{student.course}</td>
                <td>{student.academicYear}</td>
                <td>
                  {editedStudent && editedStudent._id === student._id ? (
                    <div>
                      <input 
                        type="text" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)} 
                      />
                    </div>
                  ) : (
                    <div>
                      {student.collegemail && student.collegemail.map((email, index) => (
                        <div key={index}>{email}</div>
                      ))}
                    </div>
                  )}
                </td>
                <td>
                  {editedStudent && editedStudent._id === student._id ? (
                    <button className="save-button" onClick={handleSave}>Save</button>
                  ) : (
                    <button className="edit-button" onClick={() => handleEdit(student)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentDetailsPage;
