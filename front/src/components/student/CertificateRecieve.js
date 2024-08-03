import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CertificateRecieve.css";
import UserNavbar from './UserNavbar';

import Loading from './Loading'; // Import the Loading component

const CertificateRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userEmailFromLocalStorage = localStorage.getItem('email');
    setUserEmail(userEmailFromLocalStorage);

    const fetchRequests = async () => {
      try {
        const response = await axios.get(`/api/student/certificateRequests/${userEmailFromLocalStorage}`);
        setRequests(response.data.requests);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error fetching requests');
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    if (userEmailFromLocalStorage) {
      fetchRequests();
    }
  }, [userEmail]);

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`/api/download/${fileName}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (loading) {
    return <Loading />; // Show loading component while data is being fetched
  }

  return (
    <>
      <UserNavbar />
      <div className="certificate-requests-page">
        {requests.length === 0 ? (
          <p>No certificate requests found for the logged-in user.</p>
        ) : (
          <ul>
            {requests.map((request) => (
              <li key={request._id}>
                <p>Request ID: {request._id}</p>
                <p>Student ID: {request.registerNumber}</p>
                <p>Reason: {request.reason}</p>
                <p>HoD Status: {request.HoDstatus}</p>
                <p>Officer Status: {request.status}</p>
                <p>Selected Documents: {request.selectedDocuments.join(', ')}</p>
                {request.HoDstatus === 'Declined' && <p>HoD Decline Reason: {request.hodDeclineReason}</p>}
                {request.status === 'Approved' && (
                  <button onClick={() => handleDownload(`${request._id}.pdf`)}>Download</button>
                )}
                {request.status === 'Declined' && <p>Decline Reason: {request.declineReason}</p>}
              </li>
            ))}
          </ul>
        )}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </>
  );
};

export default CertificateRequestsPage;
