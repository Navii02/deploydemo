const express = require('express');
const Teacher = require('../../models/hod/TeachersDetailSchema');
const router = express.Router();

router.get('/admin/teachers', async (req, res) => {
  try {
    const branch = req.query.branch;
    //console.log(branch);
    const teachers = await Teacher.find({ course: branch });
    res.json({ teachers });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch teachers' });
  }
});


router.post('/admin/addTeacher', async (req, res) => {
  const newTeacherData = req.body;
  try {
    const newTeacher = await Teacher.create(newTeacherData);
    res.json({ newTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/admin/updateTeacher/:id', async (req, res) => {
  const teacherId = req.params.id;
  const updatedTeacherData = req.body;
  try {
    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, updatedTeacherData, { new: true });
    res.json({ updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/admin/deleteTeacher/:id', async (req, res) => {
  const teacherId = req.params.id;
  try {
    await Teacher.findByIdAndDelete(teacherId);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
