// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const CertificateRequest = require('../../models/CertificateRequest');
const Student = require('../../models/Student/StudentData');

router.post('/student/submitRequest', async (req, res) => {
  try {
    const { registerNumber, userEmail, reason, selectedDocuments } = req.body;

    // Validate data
    if (!registerNumber || !userEmail || !reason || !selectedDocuments) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Save to MongoDB
    const newCertificateRequest = new CertificateRequest({
      registerNumber,
      userEmail,
      reason,
      selectedDocuments,
    });

    await newCertificateRequest.save();

    // Send success response
    res.status(200).json({ message: 'Certificate request submitted successfully' });
  } catch (error) {
    console.error(error);
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
