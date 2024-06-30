const cron = require('node-cron');
const mongoose = require('mongoose');
const ApprovedStudent = require('../models/Officer/ApprovedStudents'); // Replace with your model path
const Alumni = require('../models/Officer/Alumni'); // Import the Alumni model

// MongoDB connection
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define cron job to run at the start of every year (January 1st at midnight)
cron.schedule('0 0 1 1 *', async () => {
  try {
    const currentYear = new Date().getFullYear();
    //const academicYearEndYear = currentYear - 1; // Example logic for academic year end
   //console.log(academicYearEndYear);

    // Query documents to move to Alumni based on your condition
    const alumniData = await ApprovedStudent.find({
      academicYear: { $exists: true },
      $expr: {
        $lt: [
          { $toInt: { $arrayElemAt: [{ $split: ['$academicYear', '-'] }, 1] } },
          currentYear
        ]
      }
    });

    // Process each document to ensure proper format
    const processedAlumniData = alumniData.map(doc => {
      // Ensure subjectPercentages is an array of objects
      if (!Array.isArray(doc.subjectPercentages)) {
        doc.subjectPercentages = [];
      } else {
        doc.subjectPercentages = doc.subjectPercentages.filter(sp => sp.subject && sp.percentage);
      }
      return doc.toObject();
    });

    // Move data to Alumni database
    await Alumni.insertMany(processedAlumniData); // Use insertMany to insert multiple documents

    // Optionally remove moved data from current collection
    await ApprovedStudent.deleteMany({
      academicYear: { $exists: true },
      $expr: {
        $lt: [
          { $toInt: { $arrayElemAt: [{ $split: ['$academicYear', '-'] }, 1] } },
          currentYear
        ]
      }
    });

    console.log(`Moved ${alumniData.length} records to Alumni database.`);
  } catch (error) {
    console.error('Error moving data to Alumni:', error);
  }
}, {
  scheduled: true,
  timezone: 'Asia/Kolkata', // Adjust timezone as per your server timezone
});
