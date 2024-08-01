const express = require('express');
const router = express.Router();
const Faculty = require('../../models/Faculity/FaculitySchema');
const Tutor = require('../../models/Tutor/TutorSchema');
const Hod = require('../../models/hod/HodSchema');

// Fetch all faculty with specific fields
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find({});
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching faculty data' });
  }
});

// Fetch all tutors with specific fields
router.get('/admin/tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find({});
    res.json(tutors);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tutor data' });
  }
});

// Fetch all HODs with specific fields
router.get('/hods', async (req, res) => {
  try {
    const hods = await Hod.find({});
    res.json(hods);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching HOD data' });
  }
});
router.delete('/hod/:id', async (req, res) => {
  try {
    await Hod.findByIdAndDelete(req.params.id);
    res.json({ message: 'HOD deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/faculty/:id', async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/tutor/:id', async (req, res) => {
  try {
    await Tutor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tutor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
