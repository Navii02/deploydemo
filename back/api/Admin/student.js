const express = require('express');
const router = express.Router();
const User = require('../../models/Student/UserSchema'); // assuming you have a User model
const ApprovedStudent = require('../../models/Officer/ApprovedStudents'); // assuming your approved student model is in models/approvedStudent.js
const Alumni = require('../../models/Officer/Alumni'); // assuming
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new user
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a user
 // assuming your user model is in models/user.js
 // assuming your alumni model is in models/alumni.js

// Endpoint to get user status
router.get('/userStatus/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const approvedStudent = await ApprovedStudent.findOne({ email: user.email });
    if (approvedStudent) {
      return res.json({ status: 'student', createdAt: user.date });
    }

    const alumni = await Alumni.findOne({ email: user.email });
    if (alumni) {
      return res.json({ status: 'alumni', createdAt: user.date });
    }

    return res.json({ status: 'not a member', createdAt: user.date });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
