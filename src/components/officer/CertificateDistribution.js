// OfficerCertificateRequestsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OfficerNavbar from './OfficerNavbar';

function OfficerCertificateRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [file, setFile] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('/api/officer/certificateRequests');
      setRequests(response.data.requests);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleApprove = async (requestId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`/api/officer/approveRequest/${requestId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Request approved successfully!');
      fetchRequests();
      // Check the status from the response and handle accordingly
      if (response.data.status === 'Approved') {
        // Handle the case when the status is Approved
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post(`/api/officer/declineRequest/${requestId}`, { declineReason });

      setSuccessMessage('Request declined successfully!');
      fetchRequests();
      // Handle the case when the status is Declined
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <OfficerNavbar />
      <div className="certificate-requests">
        <h2>Certificate Requests</h2>
        <div className="request-list">
          {requests.map((request) => (
            <div key={request._id}>
              <h3>{request.studentName}</h3>
              <p>Request ID: {request._id}</p>
              <p>Student ID: {request.registerNumber}</p>
              <p>Reason: {request.reason}</p>
              <p>selected option:{request.selectedDocuments}</p>
              <p>Status: {request.officerstatus}</p>
              <p>fileName:{request.fileUrl}</p>
              {request.status === 'Approved' && <p>File URL: {request.fileUrl}</p>}
              {request.status === 'Declined' && <p>Decline Reason: {request.declineReason}</p>}
              <input type="file" onChange={handleFileChange} />
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

export default OfficerCertificateRequestsPage;
