// DataEntryPage.js
import React, { useState, useEffect, useCallback } from "react";
import DataEntryForm from "./DataEditing.js";
import axios from "axios";
import StudentList from "./StudentList";

function DataViewEdit() {
  const [students, setStudents] = useState([]);
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [notAcceptedStudents, setNotAcceptedStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []); // Fetch students on component mount

  const updateStudentStatus = async (studentId, status) => {
    try {
      await axios.put(`/api/students/${studentId}`, { status });
      fetchStudents();
    } catch (error) {
      console.error("Error updating student status:", error);
    }
  };

  const filterStudents = useCallback(() => {
    const accepted = students.filter((student) => student.status === "accepted");
    const notAccepted = students.filter((student) => student.status !== "accepted");
    setAcceptedStudents(accepted);
    setNotAcceptedStudents(notAccepted);
  }, [students]);

  useEffect(() => {
    filterStudents();
  }, [students,filterStudents]);

  return (
    <div>
      <DataEntryForm fetchStudents={fetchStudents} />
      <StudentList
        title="Accepted Students"
        students={acceptedStudents}
        updateStudentStatus={updateStudentStatus}
      />
      <StudentList
        title="Not Accepted Students"
        students={notAcceptedStudents}
        updateStudentStatus={updateStudentStatus}
      />
    </div>
  );
}

export default DataViewEdit;
