// Import necessary modules
const OfficerSchema = require('../../models/Officer/OfficerSchema');
const OfficersDetailsSchema = require('../../models/Admin/OfficersDetailSchema'); // Assuming the correct name of the Officers Details Schema
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const emailTransporter = require('../../nodemailer');

// Register endpoint
router.post('/officerregister', async (req, res) => {
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
    const user = await OfficerSchema.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // Create a new user instance
    const newUser = new OfficerSchema({ name, email, password });

    // Hash the password
    bcrypt.hash(password, 7, async (err, hash) => {
      if (err) return res.status(400).json({ msg: 'Error while saving the password' });

      newUser.password = hash;
      const savedUserRes = await newUser.save();

      if (savedUserRes) {
        // Send confirmation email to the user
        const mailOptions = {
          from: emailTransporter.options.auth.user,
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

// Login endpoint
router.post(`/officerlogin`, async (req, res) => {
  const { email, password } = req.body;

  // Validation checks
  if (!email || !password) {
    res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Find user in the database
    const user = await OfficerSchema.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Check if the email is also present in OfficersDetailsSchema
    const officerDetails = await OfficersDetailsSchema.findOne({ email });
    if (!officerDetails) {
      return res.status(400).json({ msg: 'Officer details not found' });
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
