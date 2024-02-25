// CertificateApproval.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';

function CertificateApproval() {
  const [requests, setRequests] = useState([]);
  const [declineReason, setDeclineReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/hod/certificateRequests');
      setRequests(response.data.requests);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await axios.post(`/api/hod/approveRequest/${requestId}`);

      setSuccessMessage('Request approved by HOD successfully!');
      fetchRequests();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post(`/api/hod/declineRequest/${requestId}`, { declineReason });

      setSuccessMessage('Request declined by HOD successfully!');
      fetchRequests();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <HodNavbar />
      <div className="certificate-requests">
        <h2>Certificate Requests (HOD)</h2>
        <div className="request-list">
          {requests.map((request) => (
            <div key={request._id}>
              <h3>{request.studentName}</h3>
              <p>Student ID: {request.registerNumber}</p>
              <p>Reason: {request.reason}</p>
              <p>selected option:{request.selectedDocuments}</p>
              <p>Status: {request.status}</p>
              <button onClick={() => handleApprove(request._id)}>Approve</button>
              <textarea
                placeholder="Decline Reason"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
              <button onClick={() => handleDecline(request._id)}>Decline</button>
            </div>
          ))}
        </div>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </>
  );
}

export default CertificateApproval;

