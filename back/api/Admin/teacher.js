const express = require('express');
const router = express.Router();
const Faculty = require('../../models/Faculity/FaculitySchema');
const Tutor = require('../../models/hod/TeachersDetailSchema');
const Hod = require('../../models/hod/HodSchema');

// Get all faculty members
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all tutors
router.get('/tutors', async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.json(tutors);
    console.log(tutors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get all HODs
router.get('/hods', async (req, res) => {
  try {
    const hods = await Hod.find();
    console.log(hods);
   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
