const express = require('express');
const Officer = require('../../models/Admin/OfficersDetailSchema');
const router = express.Router();

router.get('/officerprofile/:userEmail', async (req, res) => {
    const email = req.params.userEmail;
    console.log(email);
  
    try {
      const profile = await Officer.findOne({ email });
  
      if (!profile) {
        return res.status(404).json({ error: 'Officer profile not found' });
      }
  
      return res.json(profile);
    } catch (error) {
      console.error('Error fetching officer profile:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  });
module.exports = router;
