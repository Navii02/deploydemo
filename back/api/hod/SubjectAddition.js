const express = require('express');
const router = express.Router();
const Subject = require('../../models/hod/SubjectAddition');

// Route to add subjects
router.post('/hod/subjects', async (req, res) => {
    // Extract data from the request body
    const { semester, subjects, minorSubject, minorSubjectCode } = req.body;

    try {
        // Create a new subject document
        const newSubject = new Subject({
            semester,
            subjects,
            minorSubject,
            minorSubjectCode,
        });

        // Save the subject document to the database
        await newSubject.save();

        // Send a response back to the client
        res.status(201).json({ message: 'Subjects added successfully' });
    } catch (err) {
        console.error('Error saving subjects to the database:', err);
        res.status(500).json({ error: 'An error occurred while saving subjects' });
    }
});

// Route to update subjects
router.put('/hod/subjects/:id', async (req, res) => {
    const { id } = req.params;
    const { subjects, minorSubject, minorSubjectCode } = req.body;

    try {
        // Find the subject by ID and update its details
        await Subject.findByIdAndUpdate(id, {
            subjects,
            minorSubject,
            minorSubjectCode,
        });

        // Send a response back to the client
        res.json({ message: 'Subject details updated successfully' });
    } catch (err) {
        console.error('Error updating subject details:', err);
        res.status(500).json({ error: 'An error occurred while updating subject details' });
    }
});

// Route to get all subjects
router.get('/hod/subjects', async (req, res) => {
    try {
        // Retrieve all subjects from the database
        const subjects = await Subject.find();

        // Send the retrieved subjects to the client
        res.json(subjects);
    } catch (err) {
        console.error('Error retrieving subjects from the database:', err);
        res.status(500).json({ error: 'An error occurred while retrieving subjects' });
    }
});

module.exports = router;
