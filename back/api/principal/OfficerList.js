// Assuming you have already set up MongoDB and imported necessary modules

const express = require('express');
const router = express.Router();
const Officer = require('../../models/Principal/OfficersDetailSchema'); // Import Officer model/schema

// Route to fetch officers
router.get('/officers', async (req, res) => {
    try {
        // Fetch all officers from the database
        const officers = await Officer.find();
        res.json(officers);
    } catch (error) {
        console.error('Error fetching officers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
