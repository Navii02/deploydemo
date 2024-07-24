// routes/students.js

const express = require('express');
const router = express.Router();
const Student = require('../../models/Officer/ApprovedStudents'); // Import your Student model

// Fetch students by department and academic year
router.get('/tutor', async (req, res) => {
  const course = req.query.department;
  const academicYear = req.query.academicYear;
console.log(course,academicYear);

  try {
    const students = await Student.find({ course, academicYear });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update student details
router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error });
  }
});


router.get('/students/tutor/:department/:academicYear', async (req, res) => {
  const { department, academicYear } = req.params;
  console.log(department,academicYear);

  try {
    const students = await Student.find({ course: department, academicYear });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});
router.put('/students/semester/:department/:academicYear', async (req, res) => {
  const { department, academicYear } = req.params;
  const { semester } = req.body;

  console.log(`Updating semester for department: ${department}, academicYear: ${academicYear} to ${semester}`);

  try {
    const result = await Student.updateMany(
      { course: department, academicYear },
      { $set: { semester } }
    );
    console.log('Update result:', result);
    res.json(result);
  } catch (error) {
    console.error('Error updating semesters:', error);
    res.status(500).json({ message: 'Error updating semesters', error });
  }
});

// routes/students.js or equivalent
// Bulk update semester for all students




module.exports = router;
