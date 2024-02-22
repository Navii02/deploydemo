const express = require('express');
const Officer = require('../../models/Admin/OfficersDetailSchema');
const router = express.Router();

router.get('/admin/officers', async (req, res) => {
  try {
    const officers = await Officer.find();
    res.json({ officers });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/admin/addOfficer', async (req, res) => {
  const newOfficerData = req.body;
  try {
    const newOfficer = await Officer.create(newOfficerData);
    res.json({ newOfficer });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/admin/updateOfficer/:id', async (req, res) => {
  const officerId = req.params.id;
  const updatedOfficerData = req.body;
  try {
    const updatedOfficer = await Officer.findByIdAndUpdate(officerId, updatedOfficerData, { new: true });
    res.json({ updatedOfficer });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/admin/deleteOfficer/:id', async (req, res) => {
  const officerId = req.params.id;
  try {
    await Officer.findByIdAndDelete(officerId);
    res.json({ message: 'Officer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
