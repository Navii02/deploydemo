const express = require('express');
const path = require('path');
const { bucket } = require('../../firebase');

const app = express();

const User = require('../../models/Student/UserSchema'); // Import User model
const Student = require('../../models/Officer/ApprovedStudents'); // Import Student model

app.get('/student/:email', (req, res) => {
  const userEmail = req.params.email; // Use req.params.userEmail instead of req.params.email


  User.findOne({ email: userEmail })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      }

      return Student.findOne({ email: user.email }).exec();
    })
    .then((student) => {
      if (!student) {
        throw new Error('Student details not found');
      }

      res.json(student);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred' });
    });
});
// Route to get the Firebase Storage URL of an image
app.get('/notices/:photoPath', async (req, res) => {
  console.log(req.params.image)
  const image = req.params.photoPath;
  console.log(image)
  try {
    const file = bucket.file(`notices/${image}`);
    const [exists] = await file.exists();

    if (exists) {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2491', // Set expiration date for signed URL
      });
      res.json({ url });
    } else {
      res.status(404).json({ message: 'Photo not found' });
    }
  } catch (error) {
    console.error('Error getting photo URL:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = app
