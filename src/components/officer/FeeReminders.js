import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeeReminders.css"; // Import the CSS file
import Navbar from "./OfficerNavbar";

function FeeReminders() {
  const [students, setStudents] = useState([]);
  const [sentMessage, setSentMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const filteredStudents = students.filter((student) => {
    const unpaidYears = [];

    if (student.firstYearFees !== "paid") {
      unpaidYears.push("First Year");
    }
    if (student.secondYearFees !== "paid") {
      unpaidYears.push("Second Year");
    }
    if (student.thirdYearFees !== "paid") {
      unpaidYears.push("Third Year");
    }
    if (student.fourthYearFees !== "paid") {
      unpaidYears.push("Fourth Year");
    }

    return unpaidYears.length > 0; // Include the student in the filtered list if there are unpaid years
  });

  const sendEmail = async (student) => {
    try {
      // eslint-disable-next-line
      const { email } = student;
      const response = await axios.post("/api/send-email", { student });
      console.log("Email sent successfully!");
      console.log("Response:", response.data);
      setSentMessage(`Email sent to ${student.name}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <>
      <Navbar />
        <div className="table-layout">
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Semester</th>
                <th>Department</th>
                <th>Branch</th>
                <th>Fee Not Paid</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.semester}</td>
                  <td>{student.department}</td>
                  <td>{student.branch}</td>
                  <td>
                    {student.firstYearFees !== "paid" && <p>First Year Fee</p>}
                    {student.secondYearFees !== "paid" && <p>Second Year Fee</p>}
                    {student.thirdYearFees !== "paid" && <p>Third Year Fee</p>}
                    {student.fourthYearFees !== "paid" && <p>Fourth Year Fee</p>}
                  </td>
                  <td>
                    <button onClick={() => sendEmail(student)}>Send Email</button>
                    {sentMessage === `Email sent to ${student.name}` && (
                      <p>Email sent to {student.name}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  );
}

export default FeeReminders;
