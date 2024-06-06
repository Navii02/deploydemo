const express = require('express');
const router = express.Router();
const Subject = require('../../models/hod/SubjectAddition');

// Route to add subjects
router.post('/hod/subjects', async (req, res) => {
    const { semester, subjects, minorSubject, minorSubjectCode,branch } = req.body;

    // Validate request body
    if (!semester || !subjects || !Array.isArray(subjects)) {
        return res.status(400).json({ error: 'Invalid data. Semester and subjects are required.' });
    }

    try {
        const newSubject = new Subject({
            semester,
            subjects,
            minorSubject,
            minorSubjectCode,
            branch,
        });

        await newSubject.save();

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

    // Validate request body
    if (!subjects || !Array.isArray(subjects)) {
        return res.status(400).json({ error: 'Invalid data. Subjects must be an array.' });
    }

    try {
        await Subject.findByIdAndUpdate(id, {
            subjects,
            minorSubject,
            minorSubjectCode,
        });

        res.json({ message: 'Subject details updated successfully' });
    } catch (err) {
        console.error('Error updating subject details:', err);
        res.status(500).json({ error: 'An error occurred while updating subject details' });
    }
});

router.get('/hod/subjects', async (req, res) => {
    const { semester, branch } = req.query;

    try {
        // Create a query object to filter subjects
        const query = {};

        // Add semester filter if provided
        if (semester) {
            query.semester = parseInt(semester, 10);
        }

        // Add branch filter if provided
        if (branch) {
            query.branch = branch;
        }

        // If branch is not provided, retrieve all subjects
        if (!branch) {
            const subjects = await Subject.find(query);
            res.json(subjects);
        } else {
            // If branch is provided, retrieve subjects based on both semester and branch
            const subjects = await Subject.find(query);
            res.json(subjects);
        }
    } catch (err) {
        console.error('Error retrieving subjects from the database:', err);
        res.status(500).json({ error: 'An error occurred while retrieving subjects' });
    }
});


module.exports = router;

