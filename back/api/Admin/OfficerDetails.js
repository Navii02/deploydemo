const express = require('express');
const Officer = require('../../models/Admin/OfficersDetailSchema');
const router = express.Router();

// Retrieve all officers
router.get('/admin/officers', async (req, res) => {
  try {
    const officers = await Officer.find();
    res.json({ officers });
  } catch (error) {
    console.error('Error fetching officers:', error);
    res.status(500).json({ message: 'Failed to fetch officers' });
  }
});

// Add a new officer
router.post('/admin/addOfficer', async (req, res) => {
  const { name, post, email,number } = req.body;

  if (!name || !post || !email) {
    return res.status(400).json({ message: 'Name, post, and email are required fields' });
  }

  try {
    const newOfficer = await Officer.create({ name, post, email ,number});
    res.status(201).json({ newOfficer });
  } catch (error) {
    console.error('Error adding officer:', error);
    res.status(500).json({ message: 'Failed to add officer' });
  }
});

// Update an existing officer
router.put('/admin/updateOfficer/:id', async (req, res) => {
  const officerId = req.params.id;
  const { name, post, email ,number} = req.body;

  if (!name || !post || !email) {
    return res.status(400).json({ message: 'Name, post, and email are required fields' });
  }

  try {
    const updatedOfficer = await Officer.findByIdAndUpdate(
      officerId,
      { name, post, email,number },
      { new: true }
    );

    if (!updatedOfficer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    res.json({ updatedOfficer });
  } catch (error) {
    console.error('Error updating officer:', error);
    res.status(500).json({ message: 'Failed to update officer' });
  }
});

// Delete an officer
router.delete('/admin/deleteOfficer/:id', async (req, res) => {
  const officerId = req.params.id;

  try {
    const deletedOfficer = await Officer.findByIdAndDelete(officerId);

    if (!deletedOfficer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    res.json({ message: 'Officer deleted successfully' });
  } catch (error) {
    console.error('Error deleting officer:', error);
    res.status(500).json({ message: 'Failed to delete officer' });
  }
});

module.exports = router;
