const express = require('express');
const path = require('path');
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
app.get('/photo/:photoPath', (req, res) => {
  const photo = req.params.photoPath;
  res.sendFile(path.join(__dirname,  photo), (err) => {
    if (err) {
      res.status(404).json({ message: 'Photo not found' });
    }
  });
});

module.exports = app
