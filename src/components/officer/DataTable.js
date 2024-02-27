// StudentListContainer.js
import React, { useState } from "react";
import StudentListPage from "./StudentList";

function DataViewEdit() {
  const [enteredData, setEnteredData] = useState([]);

  const handleDataEntered = (formData) => {
    setEnteredData((prevData) => [...prevData, formData]);
  };

  return (
    <div>
      <StudentListPage students={enteredData} onDataEntered={handleDataEntered} />
    </div>
  );
}

export default DataViewEdit;



