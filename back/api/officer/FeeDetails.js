// routes/feeRoutes.js
const express = require('express');
const Fee = require('../../models/Officer/FeeDetails');
const router = express.Router();

// Route to add fee details
router.post('/fees/add', async (req, res) => {
  try {
    const newFee = new Fee(req.body);
    await newFee.save();
    res.status(201).json({ message: 'Fee details added successfully', fee: newFee });
  } catch (error) {
    res.status(500).json({ message: 'Error adding fee details', error });
  }
});
router.delete('/fees/delete/:id', async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fee details', error });
  }
});


// Route to get all fee details
router.get('/fees', async (req, res) => {
  try {
    const fees = await Fee.find();
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fee details', error });
  }
});

// Route to update fee details by ID
router.put('/fees/update/:id', async (req, res) => {
 // console.log('Request Body:', req.body); // Log request body
  try {
    const updatedFee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFee) {
      return res.status(404).json({ message: 'Fee details not found' });
    }
    res.status(200).json(updatedFee);
  } catch (error) {
    console.error('Error updating fee details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
