// Import necessary modules
const AdminSchema = require('../../models/Admin/AdminSchema');
const fs = require('fs');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const emailTransporter = require('../../nodemailer');

// Define the path to the file storing allowed names and emails
const allowedUsersFilePath = '../back/api/adminaccess.json';

// Register endpoint
router.post('/adminregister', async (req, res) => {
  const { name, email, password,role } = req.body;

  // Check if the name and email are allowed
  const allowedUsersData = JSON.parse(fs.readFileSync(allowedUsersFilePath));
  const isAllowed = allowedUsersData.some(user => user.name === name && user.email === email);
  if (!isAllowed) {
    return res.status(400).json({ msg: 'Name and email not allowed' });
  }

  // Validation checks
  if (!email || !password || !name)
    return res.status(400).json({ msg: 'Password and email are required' });

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters long' });
  }

  try {
    // Check if the user already exists
    const user = await AdminSchema.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create a new user instance
    const newUser = new AdminSchema({ name, email, password,role});

    // Hash the password
    bcrypt.hash(password, 7, async (err, hash) => {
      if (err)
        return res.status(400).json({ msg: 'Error while saving the password' });

      newUser.password = hash;
      const savedUserRes = await newUser.save();

      if (savedUserRes) {
        // Send confirmation email to the user
        const mailOptions = {
          from:  emailTransporter.options.auth.user,
          to: email,
          subject: 'Registration Successful',
          text: 'Thank you for registering. You have successfully signed up!',
        };

        emailTransporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ msg: 'Error sending confirmation email' });
          } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ msg: 'User is successfully saved' });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});
router.post(`/adminlogin`, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: 'Something missing' });
  }

  const user = await AdminSchema.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: 'User not found' });
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (matchPassword) {
    return res
      .status(200)
      .json({ msg: 'You have logged in successfully', email: user.email,role:user.role });
  } else {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
});

module.exports = router;
