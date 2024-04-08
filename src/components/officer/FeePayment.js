import React, { useState, useEffect } from 'react';

function StudentDetailsPage() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    try {
      const response = await fetch('/api/officer/details');
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
        body: JSON.stringify({ installmentIndex: installmentIndex }), // Corrected parameter name
      });
      if (!response.ok) {
        throw new Error('Failed to submit fee payment');
      }
      fetchStudentDetails();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="student-details-container">
      <h1>Student Details</h1>
      <div className="students-list">
        {students.map((student) => (
          <div key={student._id} className="student-card">
            <h2>Name: {student.name}</h2>
            <p>Roll Number: {student.admissionNumber}</p>
            <p>Branch: {student.branch}</p>
            <div className="fee-payment-section">
              <h3>Fee Payment</h3>
              <div className="fee-table">
                {student.feeCategory === 'meritRegulatedFee' ? (
                  <>
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="installment">
                        <div>Installment {index}</div>
                        <button onClick={() => handleFeePayment(student._id, index)}>Pay</button>
                      </div>
                    ))}
                  </>
                ) : student.feeCategory === 'meritFullFee' ? (
                  <>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                      <div key={index} className="installment">
                        <div>Installment {index}</div>
                        <button onClick={() => handleFeePayment(student._id, index)}>Pay</button>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>Unknown Fee Category</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentDetailsPage;
