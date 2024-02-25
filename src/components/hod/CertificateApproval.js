// CertificateApproval.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HodNavbar from './HodNavbar';

function CertificateApproval() {
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
      const response = await axios.get('/api/hod/certificateRequests');
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

      await axios.post(`/api/hod/approveRequest/${requestId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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
              {/* ... Display request details as before */}
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

export default CertificateApproval;
