const express = require('express');
const app = express();
const CertificateRequest = require('../../models/CertificateRequest');

app.get('/hod/certificateRequests', async (req, res) => {
    try {
      const requests = await CertificateRequest.find();
      res.json({ requests });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Endpoint to approve a certificate request
  app.post('/hod/approveRequest/:id', async (req, res) => {
    try {
      const requestId = req.params.id;
      await CertificateRequest.findByIdAndUpdate(requestId, { hodDecision: 'Approved' });
      res.json({ message: 'Request approved by HOD successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Endpoint to decline a certificate request
  app.post('/hod/declineRequest/:id', async (req, res) => {
    try {
      const requestId = req.params.id;
      const { declineReason } = req.body;
  
      await CertificateRequest.findByIdAndUpdate(requestId, { hodDecision: 'Declined', declineReason });
      res.json({ message: 'Request declined by HOD successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports =app