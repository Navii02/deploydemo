/*import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DataEditing.css";
import './style.css';

function DataEditing() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registerNumber: "",
    dateOfBirth: "",
    age: "",
    branch: "",
    semester: "",
    address: "",
    gender: "",
    religion: "",
    caste: "",
    category: "",
    plusTwoPercentage: "",
    tenthPercentage: "",
    firstYearFees: "",
    secondYearFees:"",
    thirdYearFees:"",
    fourthYearFees:"",
  });

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/students");
      setStudents(response.data);
     
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await axios.post("http://localhost:4000/api/students", formData);
      setFormData({
        name: "",
        email: "",
        registerNumber: "",
        dateOfBirth: "",
        age: "",
        branch: "",
        semester: "",
        address: "",
        gender: "",
        religion: "",
        caste: "",
        category: "",
        plusTwoPercentage: "",
        tenthPercentage: "",
        firstYearFees: "",
        secondYearFees:"",
        thirdYearFees:"",
        fourthYearFees:"",
      });
      fetchStudents();
      console.log(students);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  /*const handleEdit = async (student) => {
    try {
      await axios.put(`http://localhost:4000/api/students/${student._id}`,formData);
      setFormData({
        name: "",
        email: "",
        registerNumber: "",
        dateOfBirth: "",
        age: "",
        branch: "",
        semester: "",
        address: "",
        gender: "",
        religion: "",
        caste: "",
        category: "",
        plusTwoPercentage: "",
        tenthPercentage: "",
      });
      fetchStudents();
    } catch (error) {
      console.error("Error editing student:", error);
    }
  };*/
  
  /*const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/students/${id}`);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };
  

  return (
    <div>
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <label>Register Number:</label>
          <input
            type="text"
            name="registerNumber"
            value={formData.registerNumber}
            onChange={handleChange}
            placeholder="Register Number"
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        </div>
        <div className="form-group">
          <label>Branch:</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
            required
          />
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester"
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Religion:</label>
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            placeholder="Religion"
            required
          />
        </div>
        <div className="form-group">
          <label>Caste:</label>
          <input
            type="text"
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            placeholder="Caste"
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
        </div>
        <div className="form-group">
          <label>Plus Two Mark Percentage:</label>
          <input
            type="text"
            name="plusTwoPercentage"
            value={formData.plusTwoPercentage}
            onChange={handleChange}
            placeholder="Plus Two Mark Percentage"
            required
          />
        </div>
        <div className="form-group">
          <label>Tenth Mark Percentage:</label>
          <input
            type="text"
            name="tenthPercentage"
            value={formData.tenthPercentage}
            onChange={handleChange}
            placeholder="Tenth Mark Percentage"
            required
          />
        </div>
        <div className="form-group">
        <label>First Year Fees:</label>
          <input
            type="text"
            name="firstYearFees"
            value={formData.firstYearFees}
            onChange={handleChange}
            placeholder="First Year Fees"
            required
          />
        </div>
        <div className="form-group">
        <label>Second Year Fees:</label>
          <input
            type="text"
            name="secondYearFees"
            value={formData.secondYearFees}
            onChange={handleChange}
            placeholder="Second Year Fees"
            required
          />
        </div>
        <div className="form-group">
        <label>Third Year Fees:</label>
          <input
            type="text"
            name="thirdYearFees"
            value={formData.thirdYearFees}
            onChange={handleChange}
            placeholder="Third Year Fees"
            required
          />
        </div>
        <div className="form-group">
        <label>Fourth Year Fees:</label>
          <input
            type="text"
            name="fourthYearFees"
            value={formData.fourthYearFees}
            onChange={handleChange}
            placeholder="Fourth Year Fees"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
        <button
          type="button"
          className="clear-button"
          onClick={() =>
            setFormData({
              name: "",
              email: "",
              registerNumber: "",
              dateOfBirth: "",
              age: "",
              branch: "",
              semester: "",
              address: "",
              gender: "",
              religion: "",
              caste: "",
              category: "",
              plusTwoPercentage: "",
              tenthPercentage: "",
              firstYearFees:"",
              secondYearFees:"",
              thirdYearFees:"",
              fourthYearFees:"",
            })
          }
        >
          Clear
        </button>
      </form>
      </div>
      <div className="table-layout">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Register Number</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th>Branch</th>
            <th>Semester</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Religion</th>
            <th>Caste</th>
            <th>Category</th>
            <th>Plus Two Mark Percentage</th>
            <th>Tenth Mark Percentage</th>
            <th>First Year Fees</th>
            <th>Second Year Fees</th>
            <th>Third Year Fees</th>
            <th>Fourth Year Fees</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.registerNumber}</td>
              <td>{student.dateOfBirth}</td>
              <td>{student.age}</td>
              <td>{student.branch}</td>
              <td>{student.semester}</td>
              <td>{student.address}</td>
              <td>{student.gender}</td>
              <td>{student.religion}</td>
              <td>{student.caste}</td>
              <td>{student.category}</td>
              <td>{student.plusTwoPercentage}</td>
              <td>{student.tenthPercentage}</td>
              <td>{student.firstYearFees}</td>
              <td>{student.secondYearFees}</td>
              <td>{student.thirdYearFees}</td>
              <td>{student.fourthYearFees}</td>
              <td>
                 <button onClick={() => handleDelete(student._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default DataEditing;*/

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DataEditing.css"; // Import the CSS file
/*import '../../App.css'*/
import Navbar from "./OfficerNavbar";

function DataEditing() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registerNumber: "",
    dateOfBirth: "",
    age: "",
    branch: "",
    semester: "",
    address: "",
    gender: "",
    religion: "",
    caste: "",
    category: "",
    plusTwoPercentage: "",
    tenthPercentage: "",
    firstYearFees: "",
    secondYearFees:"",
    thirdYearFees:"",
    fourthYearFees:"",
  });

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      await axios.post("/api/students", formData);
      setFormData({
        name: "",
        email: "",
        registerNumber: "",
        dateOfBirth: "",
        age: "",
        branch: "",
        semester: "",
        address: "",
        gender: "",
        religion: "",
        caste: "",
        category: "",
        plusTwoPercentage: "",
        tenthPercentage: "",
        firstYearFees: "",
        secondYearFees:"",
        thirdYearFees:"",
        fourthYearFees:"",
      });
      fetchStudents();
      console.log(students);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const updateStudentFee = async (studentId, field, value) => {
    try {
      await axios.put(`/api/students/${studentId}`, {
        [field]: value,
      });
      fetchStudents(); // Fetch updated student data after successful update
    } catch (error) {
      console.error("Error updating student fee:", error);
    }
  };

  const handleFeeChange = (studentId, field, event) => {
    const { value } = event.target;
    if (value) {
      updateStudentFee(studentId, field, value.toLowerCase());
    } else {
      updateStudentFee(studentId, field, value);
    }
  };


  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`/api/students/${studentId}`);
      fetchStudents(); // Fetch updated student data after successful deletion
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  /*const handleSubmit = async (event) => {
    event.preventDefault();
    if (editedStudent._id) {
      try {
        await axios.put(
          `http://localhost:4000/api/students/${editedStudent._id}`,
          editedStudent
        );
        setEditedStudent({});
        setIsFormOpen(false);
        fetchStudents(); // Fetch updated student data after successful update
      } catch (error) {
        console.error("Error updating student:", error);
      }
    } else {
      try {
        await axios.post("http://localhost:4000/api/students", editedStudent);
        setEditedStudent({});
        setIsFormOpen(false);
        fetchStudents(); // Fetch updated student data after successful creation
      } catch (error) {
        console.error("Error creating student:", error);
      }
    }
  };*/

  return (
    <div>
      <Navbar/>
      <div className="data-editing-container">
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <label>Register Number:</label>
          <input
            type="text"
            name="registerNumber"
            value={formData.registerNumber}
            onChange={handleChange}
            placeholder="Register Number"
            required
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        </div>
        <div className="form-group">
          <label>Branch:</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
            required
          />
        </div>
        <div className="form-group">
          <label>Semester:</label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester"
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label>Religion:</label>
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            placeholder="Religion"
            required
          />
        </div>
        <div className="form-group">
          <label>Caste:</label>
          <input
            type="text"
            name="caste"
            value={formData.caste}
            onChange={handleChange}
            placeholder="Caste"
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
        </div>
        <div className="form-group">
          <label>Plus Two Mark Percentage:</label>
          <input
            type="text"
            name="plusTwoPercentage"
            value={formData.plusTwoPercentage}
            onChange={handleChange}
            placeholder="Plus Two Mark Percentage"
            required
          />
        </div>
        <div className="form-group">
          <label>Tenth Mark Percentage:</label>
          <input
            type="text"
            name="tenthPercentage"
            value={formData.tenthPercentage}
            onChange={handleChange}
            placeholder="Tenth Mark Percentage"
            required
          />
        </div>
        <div className="form-group">
        <label>First Year Fees:</label>
          <input
            type="text"
            name="firstYearFees"
            value={formData.firstYearFees}
            onChange={handleChange}
            placeholder="First Year Fees"
            required
          />
        </div>
        <div className="form-group">
        <label>Second Year Fees:</label>
          <input
            type="text"
            name="secondYearFees"
            value={formData.secondYearFees}
            onChange={handleChange}
            placeholder="Second Year Fees"
            required
          />
        </div>
        <div className="form-group">
        <label>Third Year Fees:</label>
          <input
            type="text"
            name="thirdYearFees"
            value={formData.thirdYearFees}
            onChange={handleChange}
            placeholder="Third Year Fees"
            required
          />
        </div>
        <div className="form-group">
        <label>Fourth Year Fees:</label>
          <input
            type="text"
            name="fourthYearFees"
            value={formData.fourthYearFees}
            onChange={handleChange}
            placeholder="Fourth Year Fees"
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
        <button
          type="button"
          className="clear-button"
          onClick={() =>
            setFormData({
              name: "",
              email: "",
              registerNumber: "",
              dateOfBirth: "",
              age: "",
              branch: "",
              semester: "",
              address: "",
              gender: "",
              religion: "",
              caste: "",
              category: "",
              plusTwoPercentage: "",
              tenthPercentage: "",
              firstYearFees:"",
              secondYearFees:"",
              thirdYearFees:"",
              fourthYearFees:"",
            })
          }
        >
          Clear
        </button>
      </form>
      </div>
    <div className="table-layout">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Register Number</th>
            <th>Date of Birth</th>
            <th>Age</th>
            <th>Branch</th>
            <th>Semester</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Religion</th>
            <th>Caste</th>
            <th>Category</th>
            <th>Plus Two Mark Percentage</th>
            <th>Tenth Mark Percentage</th>
            <th>First Year Fees</th>
            <th>Second Year Fees</th>
            <th>Third Year Fees</th>
            <th>Fourth Year Fees</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.registerNumber}</td>
              <td>{student.dateOfBirth}</td>
              <td>{student.age}</td>
              <td>{student.branch}</td>
              <td>{student.semester}</td>
              <td>{student.address}</td>
              <td>{student.gender}</td>
              <td>{student.religion}</td>
              <td>{student.caste}</td>
              <td>{student.category}</td>
              <td>{student.plusTwoPercentage}</td>
              <td>{student.tenthPercentage}</td>
              <td>
                <input
                  type="text"
                  value={student.firstYearFees || ""}
                  onChange={(event) =>
                    handleFeeChange(student._id, "firstYearFees", event)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={student.secondYearFees || ""}
                  onChange={(event) =>
                    handleFeeChange(student._id, "secondYearFees", event)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={student.thirdYearFees || ""}
                  onChange={(event) =>
                    handleFeeChange(student._id, "thirdYearFees", event)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={student.fourthYearFees || ""}
                  onChange={(event) =>
                    handleFeeChange(student._id, "fourthYearFees", event)
                  }
                />
              </td>
              <td>
                <button onClick={() => handleDelete(student._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
    </div>
  );
}

export default DataEditing;
