const express = require('express');
const multer = require('multer');
const { storage, ref, uploadBytes, getDownloadURL } = require('../../firebase');
const Notice = require('../../models/notice');
const { v4: uuidv4 } = require('uuid'); // To generate unique file names

const app = express();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory

// Function to handle notice upload
const handleNoticeUpload = async (req, res) => {
  try {
    const { notice } = req.body;
    const file = req.file;
    const uniqueFilename = `${uuidv4()}_${file.originalname}`;

    // Upload file to Firebase Storage
    const fileRef = ref(storage, `notices/${uniqueFilename}`);
    await uploadBytes(fileRef, file.buffer);

    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);

    const newNotice = new Notice({
      notice,
      image: downloadURL,
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

// DELETE /api/notices/:id
app.delete('/notices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});




module.exports = app;
