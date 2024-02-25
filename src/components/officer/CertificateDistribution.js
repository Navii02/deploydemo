// CertificateDistribution.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OfficerNavbar from './OfficerNavbar';

function CertificateDistribution() {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get('/api/officer/approvedRequests');
      setApprovedRequests(response.data.approvedRequests);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSendDocuments = async (requestId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await axios.post(`/api/officer/sendDocuments/${requestId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage('Documents sent successfully!');
      fetchApprovedRequests();
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <>
      <OfficerNavbar />
      <div className="approved-requests">
        <h2>Approved Requests for Document Distribution</h2>
        <div className="request-list">
          {approvedRequests.map((request) => (
            <div key={request._id}>
              {/* ... Display approved request details as needed */}
              <input type="file" onChange={handleFileChange} />
              <button onClick={() => handleSendDocuments(request._id)}>Send Documents</button>
            </div>
          ))}
        </div>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </>
  );
}

export default CertificateDistribution;
