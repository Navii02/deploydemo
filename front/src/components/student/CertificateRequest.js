import React, { useState, useEffect } from "react";
import axios from "axios";
import UserNavbar from "./UserNavbar";
import "./CertificateRequest.css";

import Loading from "./Loading";

function StudentCertificateRequestPage() {
  const [RegisterNo, setRegisterNumber] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [mobileNo, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("email") || ""
  ); // Use state for userEmail
  const [manualRegisterNo, setManualRegisterNumber] = useState("");

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `/api/student/details/${userEmail}`
        );
        const {
          
          RegisterNo,
          admissionNumber,
          mobileNo,
          name,
          semester,
          course,
        } = response.data;

        if (RegisterNo) {
          setRegisterNumber(RegisterNo);
        } else {
          setManualRegisterNumber("");
        }
        setUserEmail(userEmail);
        setAdmissionNumber(admissionNumber);
        setMobileNumber(mobileNo);
        setUserName(name);
        setSemester(semester);
        setCourse(course);
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching student details:", error);
        setErrorMessage("Failed to fetch student details");
        setLoading(false); // Set loading to false on error
      }
    };

    if (userEmail) {
      fetchStudentDetails();
    }
  }, [userEmail]);

  const handleDocumentSelection = (document) => {
    const updatedSelection = selectedDocuments.includes(document)
      ? selectedDocuments.filter((selected) => selected !== document)
      : [...selectedDocuments, document];

    setSelectedDocuments(updatedSelection);
  };

  const handleSubmit = async () => {
    setLoading(true); // Set loading to true before submission
    try {
      const response = await axios.post(
        `/api/student/submitRequest`,
        {
          userEmail,
          reason,
          selectedDocuments,
          RegisterNo: RegisterNo || manualRegisterNo,
          admissionNumber,
          phoneNumber: mobileNo,
          name: userName,
          semester,
          course,
        }
      );

      setSuccessMessage(response.data.message);

      // Reset form fields and clear messages after successful submission
      setReason("");
      setSelectedDocuments([]);
      setRegisterNumber("");
      setManualRegisterNumber("");
      setAdmissionNumber("");
      setMobileNumber("");
      setUserName("");
      setErrorMessage("");
      setLoading(false); // Set loading to false after successful submission
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error submitting request:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to submit request"
      );
      setLoading(false); // Set loading to false on error
    }
  };

  const documentOptions = [
    "SSLC Book (original)",
    "Plus Two Certificate (original)",
    "TC (Must obtain No Dues Certificate from all Depts. And Sections)",
    "Course and conduct certificate",
    "Course Completion Certificate",
    "Fee Structure for Loan/Fee paid certificate (Include Bank Details)",
    "Bonafide Certificate/Studentship Certificate",
    "Letter of Recommendation from Principal/HoD/Class Tutor",
    "Duplicate Receipt from Accounts Section",
    "Caution Deposit (Must obtain No Dues Certificate from all Depts. and Sections)",
    "Medium of Instruction (MoI) from HoI",
  ];

  const areOriginalDocumentsSelected = documentOptions
    .slice(0, 2)
    .some((document) => selectedDocuments.includes(document));

  if (loading) {
    return <Loading />; // Show loading component while data is being fetched or submitted
  }

  return (
    <>
      <UserNavbar />
      <div className="certificate-request-form">
        <div className="form-header">
          <h1>COLLEGE OF ENGINEERING POONJAR</h1>
          <h2>General Application Form</h2>
        </div>
        {!RegisterNo && (
          <label>
            Register Number:
            <input
              type="text"
              value={manualRegisterNo}
              onChange={(e) => setManualRegisterNumber(e.target.value)}
            />
          </label>
        )}
        <label>
          Admission Number:
          <input
            type="text"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
        <label>
          Reason:
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <label className="document-selection">
          Select Required Documents:
          <ul className="checkbox-list">
            {documentOptions.map((document, index) => (
              <li key={index}>
                <span
                  className={`custom-checkbox ${
                    selectedDocuments.includes(document) ? "checked" : ""
                  }`}
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
        <label>
          Contact Number:
          <input
            type="text"
            value={mobileNo}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </label>
        <button className="submit-button" onClick={handleSubmit}>
          Submit Request
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </>
  );
}

export default StudentCertificateRequestPage;
