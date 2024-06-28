const express = require('express');
const Teacher = require('../../models/hod/TeachersDetailSchema');
const Subject = require('../../models/hod/SubjectAddition');
const router = express.Router();

// GET all teachers based on course (branch)
router.get('/admin/teachers', async (req, res) => {
  try {
    const branch = req.query.branch;
    const teachers = await Teacher.find({ department: branch });
    res.json({ teachers });
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ message: 'Failed to fetch teachers' });
  }
});

// POST route to add a new teacher
router.post('/admin/addTeacher', async (req, res) => {
  const newTeacherData = req.body;
  try {
    const newTeacher = await Teacher.create(newTeacherData);
    res.json({ newTeacher });
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({ message: 'Failed to add teacher' });
  }
});

// PUT route to update an existing teacher
router.put('/admin/updateTeacher/:id', async (req, res) => {
  const teacherId = req.params.id;
  const updatedTeacherData = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, updatedTeacherData, { new: true });
    res.json({ updatedTeacher });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ message: 'Failed to update teacher' });
  }
});

// DELETE route to delete a teacher
router.delete('/admin/deleteTeacher/:id', async (req, res) => {
  const teacherId = req.params.id;
  try {
    await Teacher.findByIdAndDelete(teacherId);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ message: 'Failed to delete teacher' });
  }
});

// GET subjects based on course and semester
router.get('/admin/subjects', async (req, res) => {
  const {department, semester } = req.query;
  try {
    const subjects = await Subject.find({ department, semester });
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
});

module.exports = router;
