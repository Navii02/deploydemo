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


router.put('/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      semester,
      academicYear,
      admissionNumber,
      dateOfBirth,
      address,
      email,
      mobileNo,
      collegemail,
      RegisterNo,
      lab,
    } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      {
        name,
        semester,
        academicYear,
        admissionNumber,
        dateOfBirth,
        address,
        email,
        mobileNo,
        collegemail,
        RegisterNo,
        lab,
      },
      { new: true }
    );

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
router.put('/bulk-update-register-numbers/:tutorclass/:academicYear', async (req, res) => {
  const { tutorclass, academicYear } = req.params;
  const { registerNumberPrefix } = req.body;

  try {
    // Fetch students by tutorclass and academicYear
    const students = await Student.find({ tutorclass, academicYear }).sort({ name: 1 });

    if (!students.length) {
      return res.status(404).json({ message: 'No students found' });
    }

    // Generate new register numbers
    const updatedStudents = students.map((student, index) => {
      const newRegisterNumber = registerNumberPrefix.slice(0, -3) + String(parseInt(registerNumberPrefix.slice(-3)) + index).padStart(3, '0');
      return { ...student.toObject(), RegisterNo: newRegisterNumber };
    });

    // Update students in the database
    await Promise.all(
      updatedStudents.map(student =>
        Student.findByIdAndUpdate(student._id, { RegisterNo: student.RegisterNo }, { new: true })
      )
    );

    res.json({ message: 'Register numbers updated successfully', updatedStudents });
  } catch (error) {
    console.error('Error updating register numbers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/students/lab-assignment/:department/:academicYear', async (req, res) => {
  const { department, academicYear } = req.params;
  console.log(`Received request to update lab assignments for department: ${department}, academicYear: ${academicYear}`);

  try {
    const students = await Student.find({ course: department, academicYear }).sort({ name: 1 });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    const half = Math.ceil(students.length / 2);

    const updatedStudents = students.map((student, index) => {
      const lab = index < half ? 'Lab 1' : 'Lab 2';
      return { ...student.toObject(), lab };
    });

    await Promise.all(
      updatedStudents.map(student =>
        Student.findByIdAndUpdate(student._id, { lab: student.lab }, { new: true })
      )
    );

    res.json({ message: 'Lab assignments updated successfully', updatedStudents });
  } catch (error) {
    console.error('Error updating lab assignments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/students/initialize-emails', async (req, res) => {
  try {
    // Fetch all students
    const students = await Student.find({});

    // Update each student's college email
    await Promise.all(students.map(async (student) => {
      const email = `${student.RegisterNo.toLowerCase()}@cep.ac.in`;

      await Student.findByIdAndUpdate(student._id, {
        collegemail: email
      });
    }));

    res.status(200).json({ message: 'College emails initialized successfully!' });
  } catch (error) {
    console.error('Error initializing college emails:', error);
    res.status(500).json({ message: 'Error initializing college emails' });
  }
});

// routes/students.js or equivalent
// Bulk update semester for all students




module.exports = router;
