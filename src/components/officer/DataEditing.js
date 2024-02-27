// DataEntryForm.js
import React, { useState } from "react";
import axios from "axios";
import Navbar from "./OfficerNavbar";
import './DataEntry.css';

function DataEntryForm({ fetchStudents, onDataEntered }) {
  const [formData, setFormData] = useState({
    admissionType: "",
    admissionId: "",
    allotmentCategory: "",
    feeCategory: "",
    name: "",
    photo: null,
    address: "",
    pincode: "",
    religion: "",
    community: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    mobileNo: "",
    whatsappNo: "",
    email: "",
    entranceExam: {
      type: "",
      name: "keam",
      other: "",
    },
    entranceRollNo: "",
    entranceRank: "",
    aadharNo: "",
    course: "",
    plusTwo: {
      board: "",
      regNo: "",
      examMonthYear: "",
      percentage: "",
      schoolName: "",
      physics: "",
      chemistry: "",
      mathematics: "",
    },
    parentDetails: {
      father: {
        name: "",
        occupation: "",
        mobileNo: "",
      },
      mother: {
        name: "",
        occupation: "",
        mobileNo: "",
      },
    },
    annualIncome: "",
    nativity: "",
    bankDetails: {
      bankName: "",
      branch: "",
      accountNo: "",
      ifscCode: "",
    },
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "photo") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name.includes("plusTwo")) {
      const [, subField] = name.split(".");
      setFormData({
        ...formData,
        plusTwo: {
          ...formData.plusTwo,
          [subField]: value,
        },
      });
    } else if (name.includes("father") || name.includes("mother")) {
      const [, parentField, subField] = name.split(".");
      setFormData({
        ...formData,
        parentDetails: {
          ...formData.parentDetails,
          [parentField]: {
            ...formData.parentDetails[parentField],
            [subField]: value,
          },
        },
      });
    } else if (name === "entranceExam.type") {
      setFormData({
        ...formData,
        entranceExam: {
          ...formData.entranceExam,
          type: value,
          name: "", // Reset name when changing type
        },
      });
    } else if (name === "entranceExam.name") {
      setFormData({
        ...formData,
        entranceExam: {
          ...formData.entranceExam,
          name: value,
        },
      });
    } else if (name.startsWith("bankDetails")) {
      const [, subField] = name.split(".");
      setFormData({
        ...formData,
        bankDetails: {
          ...formData.bankDetails,
          [subField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const sendData = new FormData();

      for (const key in formData) {
        if (formData[key] instanceof Object && !(formData[key] instanceof File)) {
          for (const subKey in formData[key]) {
            sendData.append(`${key}.${subKey}`, formData[key][subKey]);
          }
        } else {
          sendData.append(key, formData[key]);
        }
      }

      await axios.post("/api/studentadmission", sendData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({
        admissionType: "",
        admissionId: "",
        allotmentCategory: "",
        feeCategory: "",
        name: "",
        photo: null,
        address: "",
        pincode: "",
        religion: "",
        community: "",
        gender: "",
        dateOfBirth: "",
        bloodGroup: "",
        mobileNo: "",
        whatsappNo: "",
        email: "",
        entranceExam: {
          type: "",
          name: "keam",
          other: "",
        },
        entranceRollNo: "",
        entranceRank: "",
        aadharNo: "",
        course: "",
        plusTwo: {
          board: "",
          regNo: "",
          examMonthYear: "",
          percentage: "",
          schoolName: "",
          physics: "",
          chemistry: "",
          mathematics: "",
        },
        parentDetails: {
          father: {
            name: "",
            occupation: "",
            mobileNo: "",
          },
          mother: {
            name: "",
            occupation: "",
            mobileNo: "",
          },
        },
        annualIncome: "",
        nativity: "",
        bankDetails: {
          bankName: "",
          branch: "",
          accountNo: "",
          ifscCode: "",
        },
      });

      fetchStudents(); // Fetch updated student list after data submission
      onDataEntered(formData); // Callback to pass entered data
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="data-entry-container">
        <div className="container">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admission Type:</label>
              <select
                name="admissionType"
                value={formData.admissionType}
                onChange={handleChange}
                required
              >
                <option value="">Select Admission Type</option>
                <option value="KEAM">KEAM</option>
                <option value="SPOT">SPOT</option>
                <option value="LET">LET</option>
              </select>
            </div>
            <div className="form-group">
              <label>Admission ID:</label>
              <input
                type="text"
                name="admissionId"
                value={formData.admissionId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Allotment Category:</label>
              <select
                name="allotmentCategory"
                value={formData.allotmentCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Allotment Category</option>
                <option value="merit">SM</option>
                <option value="management">MG</option>
              </select>
            </div>
            <div className="form-group">
              <label>Fee Category:</label>
              <select
                name="feeCategory"
                value={formData.feeCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Fee Category</option>
                <option value="meritRegulatedFee">Merit Regulated Fee</option>
                <option value="meritFullFee">Merit Full Fee</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course:</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>
                <option value="computerScience">CSE</option>
                <option value="electronicsAndCommunication">ECE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Photo:</label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                required
              />
              {formData.photo && (
                <img
                  className="photo-preview"
                  src={URL.createObjectURL(formData.photo)}
                  alt="Uploaded"
                />
              )}
            </div>
            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Pin Code:</label>
              <textarea
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Religion:</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Community:</label>
              <input
                type="text"
                name="community"
                value={formData.community}
                onChange={handleChange}
                required
              />
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
                <option value="transgender">Transgender</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Blood Group:</label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mobile No:</label>
              <input
                type="tel"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>
            <div className="form-group">
              <label>WhatsApp No:</label>
              <input
                type="tel"
                name="whatsappNo"
                value={formData.whatsappNo}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Entrance Exam:</label>
              <select
                name="entranceExam.type"
                value={formData.entranceExam.type}
                onChange={handleChange}
                required
              >
                <option value="">Exam Name</option>
                <option value="keam">KEAM</option>
                <option value="other">Other</option>
              </select>
              {formData.entranceExam.type === "other" && (
                <input
                  type="text"
                  name="entranceExam.name"
                  value={formData.entranceExam.name}
                  onChange={handleChange}
                  placeholder="Specify Exam Name"
                  required
                />
              )}
            </div>
            <div className="form-group">
              <label>Entrance Roll No:</label>
              <input
                type="text"
                name="entranceRollNo"
                value={formData.entranceRollNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Entrance Rank:</label>
              <input
                type="text"
                name="entranceRank"
                value={formData.entranceRank}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Aadhar No:</label>
              <input
                type="text"
                name="aadharNo"
                value={formData.aadharNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="box">
              <h4>Plus Two Details</h4>
              <div className="form-group">
                <label>Board:</label>
                <input
                  type="text"
                  name="plusTwo.board"
                  value={formData.plusTwo.board}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Register No:</label>
                <input
                  type="text"
                  name="plusTwo.regNo"
                  value={formData.plusTwo.regNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Exam Month and Year:</label>
                <input
                  type="text"
                  name="plusTwo.examMonthYear"
                  value={formData.plusTwo.examMonthYear}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Percentage:</label>
                <input
                  type="text"
                  name="plusTwo.percentage"
                  value={formData.plusTwo.percentage}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>School Name:</label>
                <input
                  type="text"
                  name="plusTwo.schoolName"
                  value={formData.plusTwo.schoolName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Physics:</label>
                <input
                  type="text"
                  name="plusTwo.physics"
                  value={formData.plusTwo.physics}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Chemistry:</label>
                <input
                  type="text"
                  name="plusTwo.chemistry"
                  value={formData.plusTwo.chemistry}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mathematics:</label>
                <input
                  type="text"
                  name="plusTwo.mathematics"
                  value={formData.plusTwo.mathematics}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="box">
              <h4>Parent Details</h4>
              <div className="form-group">
                <label>Father's Name:</label>
                <input
                  type="text"
                  name="parentDetails.father.name"
                  value={formData.parentDetails.father.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Occupation:</label>
                <input
                  type="text"
                  name="parentDetails.father.occupation"
                  value={formData.parentDetails.father.occupation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile No:</label>
                <input
                  type="tel"
                  name="parentDetails.father.mobileNo"
                  value={formData.parentDetails.father.mobileNo}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
              <div className="form-group">
                <label>Mother's Name:</label>
                <input
                  type="text"
                  name="parentDetails.mother.name"
                  value={formData.parentDetails.mother.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Occupation:</label>
                <input
                  type="text"
                  name="parentDetails.mother.occupation"
                  value={formData.parentDetails.mother.occupation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mobile No:</label>
                <input
                  type="tel"
                  name="parentDetails.mother.mobileNo"
                  value={formData.parentDetails.mother.mobileNo}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
              
            </div>
            <div className="form-group">
              <label>Annual Income:</label>
              <input
                type="text"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nativity:</label>
              <input
                type="text"
                name="nativity"
                value={formData.nativity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="box">
              <h4>Bank Details</h4>
              <div className="form-group">
                <label>Bank Name:</label>
                <input
                  type="text"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Branch:</label>
                <input
                  type="text"
                  name="bankDetails.branch"
                  value={formData.bankDetails.branch}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Account No:</label>
                <input
                  type="text"
                  name="bankDetails.accountNo"
                  value={formData.bankDetails.accountNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>IFSC Code:</label>
                <input
                  type="text"
                  name="bankDetails.ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="button-container">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button
                type="button"
                className="clear-button"
                onClick={() => setFormData({ 
                admissionType:"",
                admissionId: "",
                allotmentCategory: "",
                feeCategory: "",
                name: "",
                photo: null,
                address: "",
                pincode: "",
                religion: "",
                community: "",
                gender: "",
                dateOfBirth: "",
                bloodGroup: "",
                mobileNo: "",
                whatsappNo: "",
                email: "",
                entranceExam: {
                  name: "keam",
                  other: "",
                },
                entranceRollNo: "",
                entranceRank: "",
                aadharNo: "",
                course: "",
                plusTwo: {
                  board: "",
                  regNo: "",
                  examMonthYear: "",
                  percentage: "",
                  schoolName: "",
                  physics: "",
                  chemistry: "",
                  mathematics: "",
                },
                parentDetails: {
                  father: {
                    name: "",
                    occupation: "",
                    mobileNo: "",
                  },
                  mother: {
                    name: "",
                    occupation: "",
                    mobileNo: "",
                  },
                },
                annualIncome: "",
                nativity: "",
                bankDetails: {
                  bankName: "",
                  branch: "",
                  accountNo: "",
                  ifscCode: "",
                },})}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DataEntryForm;

