const mongoose = require('mongoose');
const ApprovedStudent = require('./approvedStudent'); // Adjust the path as necessary
const Alumni = require('./alumni'); // Adjust the path as necessary

const db = mongoose.connection;

db.once('open', async function() {
  console.log('Connected to the database');

  try {
    const students = await ApprovedStudent.find();
    const currentYear = new Date().getFullYear();

    for (const student of students) {
      const academicYearEnd = parseInt(student.academicYear.split('-')[1]);
      if (academicYearEnd < currentYear) {
        const alumni = new Alumni(student.toObject());
        await alumni.save();
        await ApprovedStudent.deleteOne({ _id: student._id });
        console.log(`Moved student ${student.name} to alumni.`);
      }
    }
  } catch (error) {
    console.error('Error moving students:', error);
  } finally {
    mongoose.connection.close();
  }
});

// Ensure the connection is closed gracefully on error
db.on('error', console.error.bind(console, 'connection error:'));
