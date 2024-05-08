// Assuming you have necessary imports and setup for Express and MongoDB

const express = require('express');
const router = express.Router();
const OfficerProfile = require('../../models/Admin/OfficersDetailSchema'); // Assuming this is your Mongoose model

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

module.exports = router;
