import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseurl } from '../../url';
import Navbar from './TutorNavbar';

const TutorUpdates = () => {
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    semester: '',
    academicYear:'',
    admissionNumber: '',
    dateOfBirth: '',
    address: '',
    email: '',
    mobileNo: '',
    collegemail: '',
    RegisterNo: '',
  });

  useEffect(() => {
    const tutorclass = localStorage.getItem('tutorclass');
    console.log(tutorclass);
    const academicYear = localStorage.getItem('academicYear');
    if (tutorclass && academicYear) {
      fetchStudents(tutorclass, academicYear);
    }
  }, []);

  const fetchStudents = async (tutorclass, academicYear) => {
    try {
      console.log(tutorclass,academicYear);
      const response = await axios.get(`${baseurl}/api/students/tutor/${tutorclass}/${academicYear}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setErrorMessage('Error fetching students');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEdit = (student) => {
    setSelectedStudent(student._id);
    setFormData({
      id: student._id,
      name: student.name,
      semester: student.semester,
      academicYear: student.academicYear,
      admissionNumber: student.admissionNumber,
      dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : '',
      address: student.address,
      email: student.email,
      mobileNo: student.mobileNo,
      collegemail: student.collegemail,
      RegisterNo: student.RegisterNo
    });
  };

  const handleCancel = () => {
    setSelectedStudent(null);
    resetFormData();
  };

  const resetFormData = () => {
    setFormData({
      id: '',
      name: '',
      semester: '',
      academicYear: '',
      admissionNumber: '',
      dateOfBirth: '',
      address: '',
      email: '',
      mobileNo: '',
      collegemail: '',
      RegisterNo: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form for student ID:', selectedStudent);
    console.log('Form data:', formData);

    if (!selectedStudent) {
      setErrorMessage('No student selected for update');
      return;
    }

    try {
      await axios.put(`${baseurl}/api/students/${selectedStudent}`, formData);
      fetchStudents(localStorage.getItem('class'), localStorage.getItem('academicYear'));
      setSelectedStudent(null);
      resetFormData();
    } catch (error) {
      console.error('Error updating student:', error);
      setErrorMessage('Error updating student');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <Navbar />
      <div className="update-container">
        <h2>Student Details</h2>
        <div className="student-list">
          {students.map((student) => (
            <div key={student._id} className="student-item">
              {selectedStudent === student._id ? (
                <form onSubmit={handleSubmit} className="student-form">
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
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    placeholder="Semester"
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
                    placeholder="RegisterNo"
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
                    placeholder="Phone"
                    required
                  />
                  <input
                    type="email"
                    name="collegemail"
                    value={formData.collegemail}
                    onChange={handleInputChange}
                    placeholder="Collegemail"
                    required
                  />
                  <button type="submit">Save</button>
                  <button type="button" onClick={handleCancel}>Cancel</button>
                </form>
              ) : (
                <>
                  <p><strong>Name:</strong> {student.name}</p>
                  <p><strong>Admission Number:</strong> {student.admissionNumber}</p>
                  <p><strong>RegisterNo:</strong>{student.RegisterNo}</p>
                  <p><strong>Semester:</strong>{student.semester}</p>

                  <p><strong>AcademicYear:</strong>{student.academicYear}</p>
                  <p><strong>Date of Birth:</strong> {student.dateOfBirth ? formatDate(student.dateOfBirth) : ''}</p>
                  <p><strong>Address:</strong> {student.address}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Phone:</strong> {student.mobileNo}</p>
                  <p><strong>College Email:</strong> {student.collegemail}</p>
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <hr />
                </>
              )}
            </div>
          ))}
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
};

export default TutorUpdates;
