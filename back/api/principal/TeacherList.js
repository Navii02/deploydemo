// teacher.js

const express = require('express');
const router = express.Router();
const Teacher = require('../../models/hod/TeachersDetailSchema') // Assuming you have a Teacher model defined

// Route to fetch all teachers
router.get('/teachers', async (req, res) => {
    try {
        // Fetch all teachers from the database
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
