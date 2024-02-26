// HodCertificateRequestsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';

function HodCertificateRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/hod/certificateRequests');
      setRequests(response.data.requests.reverse()); // Reverse the order
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.post(`/api/hod/acceptRequest/${requestId}`);

      setSuccessMessage('Request accepted successfully!');
      fetchRequests();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post(`/api/hod/declineRequest/${requestId}`);

      setSuccessMessage('Request declined successfully!');
      fetchRequests();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <HodNavbar />
      <div className="certificate-requests">
        <h2>Certificate Requests</h2>
        <div className="request-list">
          {requests.map((request) => (
            <div key={request._id}>
              <h3>{request.studentName}</h3>
              <p>Request ID: {request._id}</p>
              <p>Student ID: {request.registerNumber}</p>
              <p>Reason: {request.reason}</p>
              <p>selected option: {request.selectedDocuments}</p>
              <p>Status: {request.HoDstatus}</p>
              {request.status === 'Accepted' && <p>Accepted By: {request.acceptedBy}</p>}
              <input type="button" value="Accept" onClick={() => handleAccept(request._id)} />
              <input type="button" value="Decline" onClick={() => handleDecline(request._id)} />
            </div>
          ))}
        </div>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </>
  );
}

export default HodCertificateRequestsPage;
