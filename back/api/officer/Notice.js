const express = require('express');
const multer = require('multer');
//const path = require('path');
const app = express();
const Notice = require('../../models/notice');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });



// Function to handle notice upload
const handleNoticeUpload = async (req, res) => {
  try {
    const { notice } = req.body;
    const { filename } = req.file;

    const newNotice = new Notice({
      notice,
      image: filename,
    });

    await newNotice.save();
    console.log("Success");

    res.json({ message: 'Notice added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
app.post('/photos', upload.single('image'), handleNoticeUpload);

// Routes
app.get('/notices', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ notices });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = app;
