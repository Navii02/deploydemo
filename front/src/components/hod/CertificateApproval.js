import React, { useState, useEffect } from 'react';
import axios from 'axios';

import HodNavbar from './HodNavbar';
import './CertificateApproval.css'

function HodCertificateRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const storedBranch = localStorage.getItem('branch');
      const response = await axios.get(`/api/hod/certificateRequests/${storedBranch}`);
      setRequests(response.data.requests.reverse());
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error fetching requests');
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`/api/hod/acceptRequest/${requestId}`);
      setSuccessMessage('Request accepted successfully!');
      fetchRequests();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error accepting request');
    }
  };

  const handleDecline = async (requestId) => {
    const declineReason = prompt('Please enter decline reason:');
    if (!declineReason) {
      setErrorMessage('Decline reason is required');
      return;
    }

    try {
      await axios.post(`/api/hod/declineRequest/${requestId}`, { declineReason });
      setSuccessMessage('Request declined successfully!');
      fetchRequests();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Error declining request');
    }
  };

  return (
    <>
      <HodNavbar />
      <div className="certificate-requests">
        <h1>Certificate Requests</h1>
        {requests.length === 0 ? (
          <p>No requests available.</p>
        ) : (
          <div className="request-list">
            {requests.map((request) => (
              <div key={request._id}>
                <h3>{request.studentName}</h3>
                <p>Request ID: {request._id}</p>
                <p>Student ID: {request.RegisterNo}</p>
                <p>Student Name: {request.name}</p>
                <p>Student Semester: {request.semester}</p>
                <p>Course: {request.course}</p>
                <p>Reason: {request.reason}</p>
                <p>Selected Documents: {request.selectedDocuments.join(', ')}</p>
                <p>Status: {request.HoDstatus}</p>
                {request.HoDstatus === 'Pending' && (
                  <>
                    <input type="button" value="Accept" onClick={() => handleAccept(request._id)} />
                    <input type="button" value="Decline" onClick={() => handleDecline(request._id)} />
                  </>
                )}
                {request.HoDstatus === 'Accepted' && <p>Accepted By: {request.acceptedBy}</p>}
                {request.HoDstatus === 'Declined' && <p>Decline Reason: {request.hodDeclineReason}</p>}
              </div>
            ))}
          </div>
        )}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
}

export default HodCertificateRequestsPage;
