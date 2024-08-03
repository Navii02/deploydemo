import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OfficerNavbar from './OfficerNavbar';
import './CertificateDistribution.css'


function OfficerCertificateRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [file, setFile] = useState(null);
  const [declineReason, setDeclineReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAllRequests, setShowAllRequests] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`/api/officer/certificateRequests`);
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

      await axios.post(`/api/officer/approveRequest/${requestId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Request approved successfully!');
      fetchRequests();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.post(`/api/officer/declineRequest/${requestId}`, { declineReason });

      setSuccessMessage('Request declined successfully!');
      fetchRequests();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const toggleShowAllRequests = () => {
    setShowAllRequests(!showAllRequests);
  };

  return (
    <>
      <OfficerNavbar />
      <div className="certificate-distribution-container">
        <div className="request-list">
          {requests.slice(0, showAllRequests ? requests.length : 3).map((request) => (
            <div key={request._id}>
              <h3>{request.name}</h3>
              <p>Request ID: {request._id}</p>
              <p>Student ID: {request.registerNumber}</p>
              <p> Course: {request.course}</p>
              <p>Semester: {request.semester}</p>
              <p>Reason: {request.reason}</p>
              <p>selected option:{request.selectedDocuments}</p>
              <p>Status: {request.status}</p>
              {request.status === 'Approved' && <p>File URL: {request.fileUrl}</p>}
              {request.status === 'Declined' && <p>Decline Reason: {request.declineReason}</p>}
              {request.status !== 'Approved' && request.status !== 'Declined' && (
                <>
                  <input type="file" onChange={handleFileChange} />
                  <button onClick={() => handleApprove(request._id)}>Approve</button>
                  <textarea
                    placeholder="Decline Reason"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  />
                  <button onClick={() => handleDecline(request._id)}>Decline</button>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="toggle-buttons">
          {requests.length > 3 && (
            <button onClick={toggleShowAllRequests}>
              {showAllRequests ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </>
  );
}

export default OfficerCertificateRequestsPage;
