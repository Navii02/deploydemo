const express = require('express');
const router = express.Router();
const CertificateRequest = require('../../models/CertificateRequest');

router.use(express.json());

router.get('/hod/certificateRequests/:branch', async (req, res) => {
  try {
    const branch = req.params.branch.toUpperCase();
    const courseMapping = {
      'CS': ['B.Tech CSE',  'MCA', 'BBA', 'BCA'],
      'EC': ['B.Tech ECE']
      // Add mappings for other branches
    };

    const courses = courseMapping[branch] || [];
    const requests = await CertificateRequest.find({ course: { $in: courses } });

    res.json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching certificate requests' });
  }
});

router.post('/hod/acceptRequest/:requestId', async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await CertificateRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.HoDstatus = 'Accepted';
    request.acceptedBy = 'HOD';
    await request.save();

    res.json({ message: 'Request accepted successfully', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error approving request' });
  }
});

router.post('/hod/declineRequest/:requestId', async (req, res) => {
  const requestId = req.params.requestId;
  const { declineReason } = req.body;

  try {
    const request = await CertificateRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.HoDstatus = 'Declined';
    request.hodDeclineReason = declineReason;
    await request.save();

    res.json({ message: 'Request declined successfully', request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error declining request' });
  }
});

module.exports = router;
