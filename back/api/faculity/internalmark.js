const express = require('express');
const router = express.Router();
//const Subject = require('../../models/'); // Import Subject model
const Student = require('../../models/Officer/ApprovedStudents'); // Import Student model


// Define route to fetch students by semester and course (branch)
router.get('/student/:branch/:semseter', async (req, res) => {
  console.log(req.params.semester);
  const course = req.params.branch;
  const semester=req.params.semseter// Extract semester and course from URL parameters
  
  try {
    // Query students based on semester and course (branch)
    const studentsData = await Student.find({ semester, course });
    res.json({ studentsData });
  } catch (error) {
    console.error('Error fetching students data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

// Update student marks
router.put('/student/:studentId', async (req, res) => {
  const studentId = req.params.studentId;
  const { assignment1, assignment2, exam1, exam2, attendance } = req.body;

  try {
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Update student marks
    student.assignment1 = assignment1;
    student.assignment2 = assignment2;
    student.exam1 = exam1;
    student.exam2 = exam2;
    student.attendance = attendance;
    student.aggregate = calculateAggregate(assignment1, assignment2, exam1, exam2, attendance);

    await student.save();
    res.json({ message: 'Student marks updated successfully', student });
  } catch (error) {
    console.error('Error updating student marks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

// Helper function to calculate aggregate
function calculateAggregate(assignment1, assignment2, exam1, exam2, attendance) {
  // Implement your calculation logic here
  const aggregate = (parseFloat(assignment1) + parseFloat(assignment2) + parseFloat(exam1) + parseFloat(exam2)) / 4 + parseFloat(attendance);
  return aggregate.toFixed(2); // Return aggregate rounded to 2 decimal places
}
