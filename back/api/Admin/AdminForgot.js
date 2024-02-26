const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Login = require('../../models/Admin/AdminSchema');
const emailTransporter = require('../../nodemailer');
const app = express();
app.use(bodyParser.json());

app.post('/admin/sendverificationcode', async (req, res) => {
  const { email } = req.body;

  try {
    let user = await Login.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'Email not found' });
    }

    // Check if the verification code is older than 1 minute
    const currentTime = new Date();
    const oneMinuteAgo = new Date(currentTime - 120000); // 60000 milliseconds = 1 minute

    if (user.verificationCode && user.verificationCodeDate > oneMinuteAgo) {
      return res.status(400).json({ msg: 'Verification code is still valid. Please wait before requesting a new one.' });
    }

    const verificationCode = Math.floor(1000 + Math.random() * 9000);

    // Save new verification code and its date in the database
    user = await Login.findOneAndUpdate(
      { email },
      { verificationCode, verificationCodeDate: currentTime },
      { new: true }
    );

    const mailOptions = {
      from: emailTransporter.options.auth.user,
      to: email,
      subject: 'Verification Code',
      text: `Your new verification code is: ${verificationCode}`,
    };

    await emailTransporter.sendMail(mailOptions);

    res.status(200).json({ msg: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Failed to send verification code' });
  }
});

app.post('/admin/verifycodeandchangepassword', async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    let user = await Login.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'Email not found' });
    }

    // Check if the entered verification code is correct
    if (verificationCode !== user.verificationCode) {
      return res.status(400).json({ msg: 'Incorrect verification code' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and clear the verification code
    user = await Login.findOneAndUpdate(
      { email },
      { password: hashedPassword, verificationCode: '', verificationCodeDate: null },
      { new: true }
    );

    res.status(200).json({ msg: 'Password changed successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Failed to change password' });
  }
});



module.exports = app;
