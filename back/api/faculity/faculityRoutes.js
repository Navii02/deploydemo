// Import necessary modules
const FaculitySchema = require('../../models/Faculity/FaculitySchema');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

// Register endpoint
router.post('/faculityregister', async (req, res) => {
  const { name, email, password } = req.body;

  // Validation checks
  if (!email || !password || !name)
    return res.status(400).json({ msg: 'Name, email, and password are required' });

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters long' });
  }

  try {
    // Check if the user already exists
    const user = await FaculitySchema.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create a new user instance
    const newUser = new FaculitySchema({ name, email, password });

    // Hash the password
    bcrypt.hash(password, 7, async (err, hash) => {
      if (err) return res.status(400).json({ msg: 'Error while saving the password' });

      newUser.password = hash;
      const savedUserRes = await newUser.save();

      if (savedUserRes) return res.status(200).json({ msg: 'User is successfully saved' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

// Login endpoint
router.post(`/faculitylogin`, async (req, res) => {
  const { email, password } = req.body;

  // Validation checks
  if (!email || !password) {
    res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Find user in the database
    const user = await FaculitySchema.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Compare the password with the saved hash-password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (matchPassword) {
      return res
        .status(200)
        .json({ msg: 'You have logged in successfully', email: user.email });
    } else {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

module.exports = router;
