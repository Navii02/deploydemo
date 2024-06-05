// routes/hodRoutes.js

const express = require('express');
const router = express.Router();
const CertificateRequest = require('../../models/CertificateRequest');

router.use(express.json());

// Fetch all certificate requests
router.get('/hod/certificateRequests/:branch', async (req, res) => {
  try {
    const branch = req.params.branch.toUpperCase(); // Convert branch to uppercase for case-insensitive matching
    const courseMapping = {
      'CSE': ['B.Tech CSE', 'M.Tech CSE','MCA','BBA','BCA',],
      'ECE':['B.Tech ECE'] // Example mapping for CSE branch
      // Add mappings for other branches
      // ... Add mappings for other branches
    };

    const courses = courseMapping[branch] || []; 
    // Assuming each certificate request has a field named 'branch' indicating the branch related to the request
    const requests = await CertificateRequest.find({ course:  { $in: courses }});

    res.json({ requests });
  } catch (error) {
    console.error(error);
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
  const { hodDeclineReason } = req.body;

  try {
    const request = await CertificateRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Update the request status and hodDeclineReason
    request.HoDstatus = 'Declined';
    request.hodDeclineReason = hodDeclineReason;
    await request.save();

    res.json({ message: 'Request declined successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error declining request' });
  }
});


module.exports = router;
