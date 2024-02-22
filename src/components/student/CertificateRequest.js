import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './UserNavbar';
import './CertificateRequest.css';

function StudentCertificateRequestPage() {
  const [registerNumber, setRegisterNumber] = useState('');
  const userEmail = localStorage.getItem('email');
  console.log('User Email:', userEmail);
  const [reason, setReason] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDocumentSelection = (document) => {
    const updatedSelection = selectedDocuments.includes(document)
      ? selectedDocuments.filter((selected) => selected !== document)
      : [...selectedDocuments, document];

    setSelectedDocuments(updatedSelection);
  };

  const handleSubmit = async () => {
    try {
      if (!registerNumber || !reason || selectedDocuments.length === 0) {
        setErrorMessage('Register number, reason, and at least one document selection are required.');
        return;
      }

      const response = await axios.post('/api/student/submitRequest', {
        registerNumber,
        reason,
        userEmail,
        selectedDocuments,
      });

      setSuccessMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const documentOptions = [
    'SSLC Book (original)',
    'Plus Two Certificate (original)',
    'TC (Must obtain No Dues Certificate from all Depts. And Sections)',
    'Course and conduct certificate',
    'Course Completion Certificate',
    'Fee Structure for Loan/Fee paid certificate (Include Bank Details)',
    'Bonafide Certificate/Studentship Certificate',
    'Letter of Recommendation from Principal/HoD/Class Tutor',
    'Duplicate Receipt from Accounts Section',
    'Caution Deposit (Must obtain No Dues Certificate from all Depts. and Sections)',
    'Medium of Instruction (MoI) from HoI',
  ];

  const areOriginalDocumentsSelected = documentOptions
    .slice(0, 2)
    .some((document) => selectedDocuments.includes(document));

  return (
    <>
      <Navbar />
      <div className="certificate-request-form">
        <div className='form-header'>
          <h1>COLLEGE OF ENGINEERING POONJAR</h1>
          <h2>General Application Form</h2>
        </div>
        <label>
          Register Number:
          <input type="text" value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} />
        </label>
        <label>
          Admission Number:
          <input type="text" />
        </label>
        <label>
          Reason:
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <label className="document-selection">
          Select Required Documents:
          <ul className="checkbox-list">
            {documentOptions.map((document, index) => (
              <li key={index}>
                <span
                  className={`custom-checkbox ${selectedDocuments.includes(document) ? 'checked' : ''}`}
                  onClick={() => handleDocumentSelection(document)}
                />
                {document}
              </li>
            ))}
          </ul>
        </label>
        {areOriginalDocumentsSelected && (
          <label>
            Date of Return:
            <input type="text" />
          </label>
        )}
        <button className="submit-button" onClick={handleSubmit}>Submit Request</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
}

export default StudentCertificateRequestPage;
