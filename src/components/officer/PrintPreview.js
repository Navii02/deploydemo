// PrintableStudentDetails.js
import React from 'react';
import './PrintPreview.css'; // Import the CSS file

const PrintableStudentDetails = ({ student, onClose }) => {
  const renderFields = () => {
    return Object.entries(student).map(([key, value]) => (
      <div key={key} className="form-group">
        <label>{key}:</label>
        <input type="text" value={value} readOnly />
      </div>
    ));
  };

  return (
    <div>
      <h2>Selected Student Details</h2>
      <form className="printable-form">
        {renderFields()}
        <button type="button" onClick={() => { window.print(); onClose(); }}>Print</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default PrintableStudentDetails;
