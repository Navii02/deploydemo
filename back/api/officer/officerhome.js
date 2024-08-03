// Assuming you have necessary imports and setup for Express and MongoDB

const express = require('express');
const router = express.Router();
const OfficerProfile = require('../../models/Admin/OfficersDetailSchema');
const ApprovalStatus = require('../../models/ApprovalStatus');
 // Assuming this is your Mongoose model

// Route to fetch officer profile by email
router.get('/officerprofile/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    // Find officer profile by email in MongoDB
    const officerProfile = await OfficerProfile.findOne({ email: userEmail });

    if (!officerProfile) {
      return res.status(404).json({ message: 'Officer profile not found' });
    }

    // Extract name and position from officerProfile
    const { name, post } = officerProfile;

    // Respond with the officer profile data
    res.status(200).json({ name, post });
  } catch (error) {
    console.error('Error fetching officer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/status/update', async (req, res) => {
  const { isApproved } = req.body;

  try {
    const result = await ApprovalStatus.findOneAndUpdate(
      {},
      { isApproved },
      { new: true, upsert: true }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get approval status
router.get('/status', async (req, res) => {
  try {
    const status = await ApprovalStatus.findOne({});
    if (!status) {
      return res.status(404).json({ message: 'Approval status not found' });
    }
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
