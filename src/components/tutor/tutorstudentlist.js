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
  const [registerNumber, setRegisterNumber] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      const adjustedDepartment = adjustDepartmentName(department);
      const response = await axios.get(`/api/tutor?department=${adjustedDepartment}&academicYear=${academicYear}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, [department, academicYear]);

  useEffect(() => {
    const storedDepartment = localStorage.getItem('department');
    const storedAcademicYear = localStorage.getItem('academicYear');
    
    if (storedDepartment && storedAcademicYear) {
      setDepartment(storedDepartment);
      setAcademicYear(storedAcademicYear);
    }
  }, []);

  useEffect(() => {
    if (department && academicYear) {
      fetchStudents();
    }
  }, [department, academicYear, fetchStudents]);

  const adjustDepartmentName = (dept) => {
    if (dept === 'CSE') {
      return 'computerScience';
    } else if (dept === 'ECE') {
      return 'electronicsAndCommunication';
    } else {
      return dept;
    }
  };

  const handleEdit = (student) => {
    setEditedStudent({ ...student });
    setRegisterNumber(student.admissionNumber); // Set register number for editing
    setNewEmail(''); // Reset newEmail when editing a new student
  };

  const handleSave = async () => {
    try {
      if (editedStudent) {
        // Save the edited student details
        const updatedStudentResponse = await axios.put(`/api/students/${editedStudent._id}`, editedStudent);
        console.log('Student updated:', updatedStudentResponse.data);

        // Check if there's a new email to add
        if (newEmail.trim() !== '') {
          // Send a POST request to add the new email to the student
          const response = await axios.post(`/api/students/${editedStudent._id}/emails`, { email: newEmail });
          console.log('New email added:', response.data);
          setNewEmail(''); // Reset newEmail field after adding
        }

        // Reset editedStudent and registerNumber, and fetch updated student list
        setEditedStudent(null);
        setRegisterNumber('');
        fetchStudents();
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="student-details-table-container">
        <table className="student-details-table">
          <thead>
            <tr>
              <th>Admission Number</th>
              <th>Name</th>
              <th>Semester</th>
              <th>Register Number</th>
              <th>Department</th>
              <th>Academic Year</th>
              <th>College Emails</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>
                  {editedStudent && editedStudent._id === student._id ? (
                    <input 
                      type="text" 
                      value={registerNumber} 
                      onChange={(e) => setRegisterNumber(e.target.value)} 
                    />
                  ) : (
                    student.admissionNumber
                  )}
                </td>
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
                    <td>
                  {editedStudent && editedStudent._id === student._id ? (
                    <input 
                      type="text" 
                      value={editedStudent.registerNumber}  
                      onChange={(e) => setEditedStudent({ ...editedStudent, registerNumber: e.target.value })} 
                    />
                  ) : (
                    student.registerNumber
                  )}
                </td>
                <td>{student.course}</td>
                <td>{student.academicYear}</td>
                <td>
                  {editedStudent && editedStudent._id === student._id ? (
                    <div>
                      {editedStudent.collegemail && editedStudent.collegemail.map((email, index) => (
                        <div key={index}>
                          <input 
                            type="text" 
                            value={email} 
                            onChange={(e) => {
                              const updatedEmails = [...editedStudent.collegemail];
                              updatedEmails[index] = e.target.value;
                              setEditedStudent({ ...editedStudent, collegemail: updatedEmails });
                            }} 
                          />
                        </div>
                      ))}
                      <input 
                        type="text" 
                        value={newEmail} 
                        onChange={(e) => setNewEmail(e.target.value)} 
                        placeholder="Add New Email" 
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
