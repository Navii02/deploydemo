// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const CertificateRequest = require('../../models/CertificateRequest');
const ApprovedStudent = require('../../models/Officer/ApprovedStudents');
//const Student = require('../../models/Student/StudentData');


router.post('/student/submitRequest', async (req, res) => {
  try {
    const {name, userEmail, reason, selectedDocuments, RegisterNo, admissionNumber, phoneNumber,semester,course } = req.body;

    // Validate request data
    if (!userEmail || !reason || !selectedDocuments) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Save certificate request in CertificateRequest schema
    const newCertificateRequest = new CertificateRequest({
      name,
      RegisterNo,
      admissionNumber,
      userEmail,
      reason,
      selectedDocuments,
      phoneNumber,
      semester,
      course,
    });

    await newCertificateRequest.save();

    // Send success response
    res.status(200).json({ message: 'Certificate request submitted successfully' });
  } catch (error) {
    console.error('Error submitting certificate request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Endpoint to fetch student details (register number, admission number, phone number) from ApprovedStudent schema
router.get('/student/details/:email', async (req, res) => {
  try {
    const email = req.params.email;

    // Find student details in ApprovedStudent schema using userEmail
    const studentDetails = await ApprovedStudent.findOne({ email });

    if (!studentDetails) {
      return res.status(404).json({ message: 'Student not found or not approved' });
    }

    // Send student details to the frontend
    const {name, RegisterNo, admissionNumber, mobileNo,semester,course } = studentDetails;
    res.status(200).json({name, RegisterNo, admissionNumber,mobileNo,semester,course });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/student/certificateRequests/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;
    const requests = await CertificateRequest.find({ userEmail }).sort({ createdAt: -1 });

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;