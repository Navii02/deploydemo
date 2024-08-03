import React, { useState, useEffect } from 'react';
import Navbar from './OfficerNavbar';

import './Feepayment.css';


function StudentDetailsPage() {
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch(`/api/officer/details`);
      if (!response.ok) {
        throw new Error('Failed to fetch student details');
      }
      const data = await response.json();
      setStudents(data.students);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFeePayment = async (studentId, installmentIndex) => {
    try {
      const response = await fetch(`/api/officer/fee-payment/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ installmentIndex }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit fee payment');
      }
      fetchStudentDetails();
    } catch (error) {
      console.error('Fee payment error:', error.message);
    }
  };

  const handleCourseChange = (event) => {
    const course = event.target.value;
    setSelectedCourse(course);
    // Clear selected semester when course changes
    setSelectedSemester('');
  };

  const handleSemesterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedSemester(selectedValue);
  };

  // Filtered students based on selected course and semester
  const filteredStudents = students.filter((student) => {
    const courseMatch = !selectedCourse || student.course === selectedCourse;
    const semesterMatch =
      !selectedSemester || (student.semester && student.semester.toString() === selectedSemester);

    return courseMatch && semesterMatch;
  });

  return (
    <>
    <Navbar/>
    <div className="student-details-container">
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

      <div className="student-list-container">
        {filteredStudents.map((student) => (
          <div key={student._id} className="student-details-card">
            <p>Name: {student.name}</p>
            <p>Admission Number: {student.admissionNumber}</p>
            <p>Branch: {student.course}</p>
            <p>Semester: {student.semester}</p>
            <div className="fee-payment-section">
              <h3>Fee Payment</h3>
              <div className="fee-table">
                {[...Array(getInstallmentCount(student))].map((_, index) => {
                  const installmentNumber = index + 1;
                  const isPaid = student.installmentsPaid && student.installmentsPaid.includes(installmentNumber);

                  return (
                    <div key={installmentNumber} className="installment-item">
                      <div>Installment {installmentNumber}</div>
                      {isPaid ? (
                        <p className="paid-text">Paid</p>
                      ) : (
                        <button
                          onClick={() => handleFeePayment(student._id, installmentNumber)}
                          disabled={isPaid}
                          className="pay-button"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

function getInstallmentCount(student) {
  // Determine the number of installments based on course and fee category
  if (student.course === 'MCA') {
    return student.feeCategory === 'Merit Lower Fee' ? 1 : 2;
  } else {
    return student.feeCategory === 'Merit Lower Fee' ? 4 : 8;
  }
}

export default StudentDetailsPage;
