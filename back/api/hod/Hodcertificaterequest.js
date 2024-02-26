// routes/hodRoutes.js

const express = require('express');
const router = express.Router();
const CertificateRequest = require('../../models/CertificateRequest');

router.use(express.json());

// Fetch all certificate requests
router.get('/hod/certificateRequests', async (req, res) => {
  try {
    const requests = await CertificateRequest.find();
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certificate requests' });
  }
});

// Approve request
router.post('/hod/acceptRequest/:requestId', async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await CertificateRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update the request status and acceptedBy
    request.HoDstatus = 'Accepted';
    request.acceptedBy = 'HOD'; // You can customize this based on your authentication system
    await request.save();

    res.json({ message: 'Request accepted successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error approving request' });
  }
});

// Decline request
router.post('/hod/declineRequest/:requestId', async (req, res) => {
  const requestId = req.params.requestId;
  const { declineReason } = req.body;

  try {
    const request = await CertificateRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update the request status and declineReason
    request.status = 'Declined';
    request.declineReason = declineReason;
    await request.save();

    res.json({ message: 'Request declined successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error declining request' });
  }
});

module.exports = router;
