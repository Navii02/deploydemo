const express = require('express');
const router = express.Router();
const Subject = require('../../models/hod/SubjectAddition');

// Route to add subjects
router.get('/hod/subjects', async (req, res) => {
    try {
      const { semester, course, branch } = req.query;
      const subjects = await Subject.find({ semester, course, branch });
      res.json(subjects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Add new subjects
  router.post('/hod/subjects', async (req, res) => {
    try {
      const { semester, subjects, minorSubject, minorSubjectCode, branch, course } = req.body;
      const newSubject = new Subject({
        semester,
        subjects,
        minorSubject,
        minorSubjectCode,
        branch,
        course
      });
      await newSubject.save();
      res.status(201).json(newSubject);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Update existing subject
  router.put('/hod/subjects/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedSubject);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = router;