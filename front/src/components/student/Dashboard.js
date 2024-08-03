import React, { useEffect, useState, useCallback } from 'react';
import '../../App.css';

import UserNavbar from './UserNavbar';
import './Dashboard.css';
import Loading from './Loading'; // Import the Loading component

function Dashboard() {
  const [student, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const userEmail = localStorage.getItem('email'); // Get the user's email from localStorage

  const fetchStudentDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/student/${userEmail}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStudentDetails(data);

      // Save course and semester in localStorage
      localStorage.setItem('course', data.course);
      localStorage.setItem('semester', data.semester);

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    fetchStudentDetails();

    const intervalId = setInterval(fetchStudentDetails, 300000); // Fetch data every 5 minutes (300000 milliseconds)

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [fetchStudentDetails]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (loading) {
    return (
      <>
        <UserNavbar />
        <Loading /> {/* Use the Loading component */}
      </>
    );
  }

  if (error) {
    return (
      <>
        <UserNavbar />
        <div className="dashboard-container">
          <p className="error-text">Error: {error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="dashboard-container">
        {student ? (
          <div className="student-details">
            <div className="student-info">

              <div className="student-table-container">
                <table className="student-table">
                  <tbody>
                    <tr>
                      <td className="table-heading">Name:</td>
                      <td>{student.name}</td>
                    </tr>
                    <tr>
                      <td className="table-heading"> Register No</td>
                      <td>{student.RegisterNo}</td>
                    </tr>
                    <tr>
                      <td className="table-heading">College Mail</td>
                      <td>{student.collegemail}</td>
                    </tr>
                    <tr>
                      <td className="table-heading">Email:</td>
                      <td>{student.email}</td>
                    </tr>
                    <tr>
                      <td className="table-heading">Register Number:</td>
                      <td>{student.admissionNumber}</td>
                    </tr>
                    <tr>
                      <td className="table-heading">Date of Birth:</td>
                      <td>{formatDate(student.dateOfBirth)}</td>
                    </tr>
                    <tr>
                      <td className="table-heading">Branch:</td>
                      <td>{student.course}</td>
                    </tr>
                    <tr>
                      <td className="table-heading">Semester:</td>
                      <td>{student.semester}</td>
                    </tr>
                    {showDetails && (
                      <>
                        <tr>
                          <td className="table-heading">Address:</td>
                          <td>{student.address}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Gender:</td>
                          <td>{student.gender}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Religion:</td>
                          <td>{student.religion}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Caste:</td>
                          <td>{student.community}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Mobile No:</td>
                          <td>{student.mobileNo}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">WhatsApp No:</td>
                          <td>{student.whatsappNo}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Entrance Exam:</td>
                          <td>{student.entranceExam}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Entrance Roll No:</td>
                          <td>{student.entranceRollNo}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Entrance Rank:</td>
                          <td>{student.entranceRank}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Blood Group:</td>
                          <td>{student.bloodGroup}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Aadhar No:</td>
                          <td>{student.aadharNo}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Annual Income:</td>
                          <td>{student.annualIncome}</td>
                        </tr>
                        <tr>
                          <td className="table-heading">Nativity:</td>
                          <td>{student.nativity}</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
                <button className="toggle-details-btn" onClick={toggleDetails}>
                  {showDetails ? 'Show Less' : 'Show More'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="loading-text">No student data available.</p>
        )}
      </div>
    </>
  );
}

export default Dashboard;
