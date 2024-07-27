import React, { useState, useRef } from "react";
import axios from "axios";
import Navbar from "./OfficerNavbar";
import "./DataEditing.css";
import Modal from "react-modal";
import { baseurl } from "../../url";

Modal.setAppElement("#root");

const DataEntryForm = ({ fetchStudents, onDataEntered }) => {
  const initialFormData = {
    admissionType: "",
    admissionId: "",
    allotmentCategory: "",
    feeCategory: "",
    name: "",
    photo: null,
    address: "",
    permanentAddress: "",
    pincode: "",
    religion: "",
    community: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    mobileNo: "",
    whatsappNo: "",
    email: "",
    entranceExam: "",
    entranceRollNo: "",
    entranceRank: "",
    aadharNo: "",

    qualify: {
      exam: "",
      board: "",
      regNo: "",
      examMonthYear: "",
      percentage: "",
      cgpa: "",
      institution: "",
    },
    parentDetails: {
      fatherName: "",
      fatherOccupation: "",
      fatherMobileNo: "",
      motherName: "",
      motherOccupation: "",
      motherMobileNo: "",
    },
    annualIncome: "",
    nativity: "",
    bankDetails: {
      bankName: "",
      branch: "",
      accountNo: "",
      ifscCode: "",
    },
    achievements: {
      arts: "",
      sports: "",
      other: "",
    },
    course: "",
    marks: {
      boardType: "",
      physics: "",
      chemistry: "",
      maths: "",
    },
    certificates: {
      tenth: false,
      plusTwo: false,
      tcandconduct: false,
      allotmentmemo: false,
      Datasheet: false,
      physicalfitness: false,
      passportsizephoto: false,
      incomecertificates: false,
      communitycertificate: false,
      castecertificate: false,
      aadhaar: false,
      other: false,
    },
  };

  const [formData, setFormData] = useState({ ...initialFormData });
  const [copyClicked] = useState(false);
  const fileInputRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [copyAddressOption, setCopyAddressOption] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCameraCapture = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = mediaStream;
      videoRef.current.play(); // Start playing the video

      // Display both video and canvas elements
      videoRef.current.style.display = "block";
      canvasRef.current.style.display = "block";

      // Introduce a delay before capturing the photo (adjust as needed)
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Ensure video dimensions match canvas dimensions
      const { videoWidth, videoHeight } = videoRef.current;
      canvas.width = videoWidth;
      canvas.height = videoHeight;

      // Draw the video frame onto the canvas
      context.translate(videoWidth, 0); // Flip horizontally
      context.scale(-1, 1); // Mirror image horizontally
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Reset transformation to prevent further mirroring
      context.setTransform(1, 0, 0, 1, 0, 0);

      // Show a confirmation dialog to capture the photo
      const captureConfirmed = window.confirm(
        "Do you want to capture this photo?"
      );
      if (captureConfirmed) {
        // Capture the photo from the canvas
        const photoData = canvas.toDataURL("image/jpeg");
        const blob = await fetch(photoData).then((res) => res.blob());
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
        setFormData({ ...formData, photo: file });

        // Hide the video and canvas elements after capturing the photo
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.style.display = "none";
        canvasRef.current.style.display = "none";
      } else {
        // If capture is cancelled, stop video stream and hide elements
        mediaStream.getTracks().forEach((track) => track.stop());
        videoRef.current.style.display = "none";
        canvasRef.current.style.display = "none";
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const handleCopyAddress = () => {
    setCopyAddressOption(!copyAddressOption);
    if (!copyAddressOption) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        permanentAddress: prevFormData.address,
      }));
    }
  };

  const handleFileInputChange = (event) => {
    const { name, files } = event.target;
    if (name === "photo") {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const handleChange = (event) => {
    const { name, value, files, checked, type } = event.target;
    if (name === "photo") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (name === "permanentAddress" && copyClicked) {
      // Allow manual typing if the copy button is clicked
      setFormData({ ...formData, [name]: value });
    } else if (name.includes("qualify")) {
      const [, subField] = name.split(".");
      setFormData({
        ...formData,
        qualify: {
          ...formData.qualify,
          [subField]: value,
        },
      });
    } else if (name.includes("parentDetails")) {
      const [, subField] = name.split(".");
      setFormData({
        ...formData,
        parentDetails: {
          ...formData.parentDetails,
          [subField]: value,
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
    } else if (type === "checkbox") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        certificates: {
          ...prevFormData.certificates,
          [name]: checked,
        },
      }));
    } else if (name.includes("marks")) {
      const [, subField] = name.split(".");
      setFormData({
        ...formData,
        marks: {
          ...formData.marks,
          [subField]: value,
        },
      });
    } else if (name.startsWith("achievements")) {
      // Handle achievements fields
      setFormData({
        ...formData,
        achievements: {
          ...formData.achievements,
          [name.split(".")[1]]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const sendData = new FormData();
   
    // Append form data
    for (const key in formData) {
      if (formData[key] instanceof Object && !(formData[key] instanceof File)) {
        for (const subKey in formData[key]) {
          sendData.append(`${key}.${subKey}`, formData[key][subKey]);
        }
      } else {
        sendData.append(key, formData[key] ? formData[key] : "nil");
      }
    }
  
    try {
      const response = await axios.post(
        `${baseurl}/api/studentadmission`,
        sendData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Data submitted successfully:", response.data);
      setFormData({ ...initialFormData });
      setErrorMessage("Data submitted successfully"); // Use the same state variable for success message
      setModalIsOpen(true); // Open the modal on success
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Error submitting form");
      } else {
        setErrorMessage("Error submitting form");
      }
      setModalIsOpen(true); // Open the modal on error
    } finally {
      setLoading(false);
    }
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
    window.location.reload();
  };

  return (
    <div>
    <div>
      <Navbar />
      <div className="data-entry-container">
        <div className="page-title">Admission Form</div>
        <hr class="divider"></hr>
        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="form-group">
              <label className="required">Admission Type:</label>
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
              <label className="required">Allotment Category:</label>
              <select
                name="allotmentCategory"
                value={formData.allotmentCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Allotment Category</option>
                <option value="State Merit">SM</option>
              </select>
            </div>
            <div className="form-group">
              <label className="required">Fee Category:</label>
              <select
                name="feeCategory"
                value={formData.feeCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Fee Category</option>
                <option value="Merit Lower Fee">Merit Lower Fee</option>
                <option value="Merit Higher Fee">Merit Higher Fee</option>
              </select>
            </div>
            <div className="form-group">
              <label className="required"> Course:</label>
              <select
                value={formData.course}
                onChange={(e) =>
                  setFormData({ ...formData, course: e.target.value })
                }
              >
                <option value="">Select Course</option>
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="BBA">BBA</option>
                <option value="BCA">BCA</option>
                <option value="MCA">MCA</option>
                {/* Add other courses as needed */}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="required">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="required">Photo:</label>
            <div className="button-container">
              <input
                ref={fileInputRef}
                type="file"
                name="photo"
                onChange={handleFileInputChange}
                accept="image/*"
                style={{ opacity: 0, position: "absolute", zIndex: -1 }} // Hide but keep accessible
              />
              <button
                type="button"
                className="capture-button"
                onClick={handleCameraCapture}
              >
                Capture Photo
              </button>
              <button
                type="button"
                className="upload-button"
                onClick={() => fileInputRef.current.click()}
              >
                Upload Photo
              </button>
              {formData.photo && (
                <img
                  className="photo-preview"
                  src={URL.createObjectURL(formData.photo)}
                  alt="Uploaded"
                />
              )}
            </div>
            {/* Video and canvas elements for camera capture */}
            <video ref={videoRef} style={{ display: "none" }}></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
          </div>

          <div className="form-group">
            <label className="required">Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label className="radio-label">
              <input
                type="radio"
                checked={copyAddressOption}
                onChange={handleCopyAddress}
              />
              Copy Address
            </label>
            <label>Permanent Address:</label>
            <textarea
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              disabled={copyAddressOption}
              required
            />
          </div>

          <div className="form-group">
            <label className="required">pincode:</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="row">
            <div className="form-group">
              <label className="required">Religion:</label>
              <input
                type="text"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="required">Community:</label>
              <input
                type="text"
                name="community"
                value={formData.community}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label className="required">Date Of Birth:</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="required">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
                <option value="Prefer to not say">Prefer to not say</option>
              </select>
            </div>

            <div className="form-group">
              <label className="required">Blood Group:</label>
              <input
                type="text"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="required">Mobile No:</label>
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
            <label className="required">WhatsApp No:</label>
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
            <label className="required">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="required">Entrance Exam Name:</label>
            <input
              type="text"
              name="entranceExam"
              value={formData.entranceExam}
              onChange={handleChange}
              required
            />
          </div>
          <div className="parent-details-row">
            <div className="form-group">
              <label className="required">Entrance Roll No:</label>
              <input
                type="text"
                name="entranceRollNo"
                value={formData.entranceRollNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="required">Entrance Rank:</label>
              <input
                type="text"
                name="entranceRank"
                value={formData.entranceRank}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {formData.course === "B.Tech CSE" ||
          formData.course === "B.Tech ECE" ? (
            <>
              <div className="form-group">
                <div className="box">
                  <h4>Plus Two Mark</h4>
                  <label className="required">
                    (Please Enter Plus Two Mark Only)
                  </label>
                  <div className="radio-group-row">
                    <label>
                      <input
                        type="radio"
                        name="marks.boardType"
                        value="State"
                        checked={formData.marks.boardType === "State"}
                        onChange={handleChange}
                      />
                      <span></span> State
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="marks.boardType"
                        value="CBSE"
                        checked={formData.marks.boardType === "CBSE"}
                        onChange={handleChange}
                      />
                      <span></span> CBSE
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="marks.boardType"
                        value="ICSE"
                        checked={formData.marks.boardType === "ICSE"}
                        onChange={handleChange}
                      />
                      <span></span> ICSE
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="marks.boardType"
                        value="Others"
                        checked={formData.marks.boardType === "Others"}
                        onChange={handleChange}
                      />
                      <span></span> Others
                    </label>
                  </div>

                  <div className="row">
                    <label>
                      Physics Marks:
                      <input
                        type="number"
                        name="marks.physics"
                        value={formData.marks.physics}
                        onChange={handleChange}
                      />
                    </label>

                    <label>
                      Chemistry Marks:
                      <input
                        type="number"
                        name="marks.chemistry"
                        value={formData.marks.chemistry}
                        onChange={handleChange}
                      />
                    </label>

                    <label>
                      Maths Marks:
                      <input
                        type="number"
                        name="marks.maths"
                        value={formData.marks.maths}
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          <div className="form-group">
            <label className="required">Aadhar No:</label>
            <input
              type="text"
              name="aadharNo"
              value={formData.aadharNo}
              onChange={handleChange}
              pattern="[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}"
              title="Please enter a valid Aadhar number"
              required
            />
          </div>
          <div className="box">
            <div className="parent-details-row">
              <div className="form-group">
                <label className="required">Qualifying Exam:</label>
                <input
                  type="text"
                  name="qualify.exam"
                  value={formData.qualify.exam}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Board:</label>
                <input
                  type="text"
                  name="qualify.board"
                  value={formData.qualify.board}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Institution:</label>
                <input
                  type="text"
                  name="qualify.institution"
                  value={formData.qualify.institution}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Reg No:</label>
                <input
                  type="text"
                  name="qualify.regNo"
                  value={formData.qualify.regNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Exam Month/Year:</label>
                <input
                  type="text"
                  name="qualify.examMonthYear"
                  value={formData.qualify.examMonthYear}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="required">Percentage:</label>
                <input
                  type="text"
                  name="qualify.percentage"
                  value={formData.qualify.percentage}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>CGPA:</label>
                <input
                  type="text"
                  name="qualify.cgpa"
                  value={formData.qualify.cgpa}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="box">
            <h4>Parents Details</h4>
            <div className="parent-details-row">
              <div className="form-group">
                <label>Father's Name:</label>
                <input
                  type="text"
                  name="parentDetails.fatherName"
                  value={formData.parentDetails.fatherName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Mother's Name:</label>
                <input
                  type="text"
                  name="parentDetails.motherName" // Changed from "parentDetails.mother.name"
                  value={formData.parentDetails.motherName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Father's Occupation:</label>
                <input
                  type="text"
                  name="parentDetails.fatherOccupation"
                  value={formData.parentDetails.fatherOccupation}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Mother's Occupation:</label>
                <input
                  type="text"
                  name="parentDetails.motherOccupation"
                  value={formData.parentDetails.motherOccupation}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Father's Mobile No:</label>
                <input
                  type="tel"
                  name="parentDetails.fatherMobileNo"
                  value={formData.parentDetails.fatherMobileNo}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>

              <div className="form-group">
                <label>Mother's Mobile No:</label>
                <input
                  type="tel"
                  name="parentDetails.motherMobileNo"
                  value={formData.parentDetails.motherMobileNo}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label className="required">Annual Income:</label>
              <input
                type="text"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="required">Nativity:</label>
              <input
                type="text"
                name="nativity"
                value={formData.nativity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="box">
            <h4>Bank Details</h4>
            <div className="parent-details-row">
              <div className="form-group">
                <label>Bank Name:</label>
                <input
                  type="text"
                  name="bankDetails.bankName"
                  value={formData.bankDetails.bankName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Branch:</label>
                <input
                  type="text"
                  name="bankDetails.branch"
                  value={formData.bankDetails.branch}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Account No:</label>
                <input
                  type="text"
                  name="bankDetails.accountNo"
                  value={formData.bankDetails.accountNo}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>IFSC Code:</label>
                <input
                  type="text"
                  name="bankDetails.ifscCode"
                  value={formData.bankDetails.ifscCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="box">
            <h4>Achievements</h4>
            <div className="row">
              <div className="form-group">
                <label>Arts:</label>
                <input
                  type="text"
                  name="achievements.arts"
                  value={formData.achievements.arts}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Sports:</label>
                <input
                  type="text"
                  name="achievements.sports"
                  value={formData.achievements.sports}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Other:</label>
                <input
                  type="text"
                  name="achievements.other"
                  value={formData.achievements.other}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="checkbox-container">
            <label className="required">Submitted Certificates</label>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="tenth"
                name="tenth"
                checked={formData.certificates.tenth}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="tenth">10th Certificate</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="plusTwo"
                name="plusTwo"
                checked={formData.certificates.plusTwo}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="plusTwo">12th Certificate</label>
            </div>

            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="tcandconduct"
                name="tcandconduct"
                checked={formData.certificates.tcandconduct}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="tcandconduct">TC and Conduct Certificate</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="allotmentmemo"
                name="allotmentmemo"
                checked={formData.certificates.allotmentmemo}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="allotmentmemo">Allotment Memo</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="Datasheet"
                name="Datasheet"
                checked={formData.certificates.Datasheet}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="Datasheet">Data Sheet</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="physicalfitness"
                name="physicalfitness"
                checked={formData.certificates.physicalfitness}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="physicalfitness">physicalfitness</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="aadhaar"
                name="aadhaar"
                checked={formData.certificates.aadhaar}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="aadhaar">Copy of Aadhaar Card</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="passportsizephoto"
                name="passportsizephoto"
                checked={formData.certificates.passportsizephoto}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="passportsizephoto">
                Passportsize Photo(2 Nos)
              </label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="incomecertificates"
                name="incomecertificates"
                checked={formData.certificates.incomecertificates}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="incomecertificates">Income Certificate</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="communitycertificate"
                name="communitycertificate"
                checked={formData.certificates.communitycertificate}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="communitycertificate">
                Community Certificate
              </label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="castecertificate"
                name="castecertificate"
                checked={formData.certificates.castecertificate}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="castecertificate">Caste Certificate</label>
            </div>
            <div className="checkbox-custom">
              <input
                type="checkbox"
                id="other"
                name="other"
                checked={formData.certificates.other}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <label htmlFor="other">Other</label>
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="submit-button">
              Submit
            </button>
            <button
              type="button"
              className="clear-button"
              onClick={() => setFormData({ ...initialFormData })}
            >
              Clear
            </button>
          </div>
        </form>
       
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Saving...</p>
          </div>
        )}
      </div>
    
    </div>
   
<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Message Modal"
  className="modal"
  overlayClassName="modal-overlay"
>
  <h3>{errorMessage === "Data submitted successfully" ? "Success" : "Error"}</h3>
  <p>{errorMessage}</p>
  <button onClick={closeModal}>Close</button>
</Modal>
    </div>
  );
};
export default DataEntryForm;