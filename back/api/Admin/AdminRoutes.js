const AdminSchema = require('../../models/Admin/AdminSchema');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/adminregister', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name)
    return res.status(400).json({ msg: 'Password and email are required' });

  if (password.length < 8) {
    return res
      .status(400)
      .json({ msg: 'Password should be at least 8 characters long' });
  }

  const user = await AdminSchema.findOne({ email });
  if (user) return res.status(400).json({ msg: 'User already exists' });

  const newUser = new AdminSchema({ name, email, password });

  bcrypt.hash(password, 7, async (err, hash) => {
    if (err)
      return res.status(400).json({ msg: 'Error while saving the password' });

    newUser.password = hash;
    const savedUserRes = await newUser.save();

    if (savedUserRes)
      return res.status(200).json({ msg: 'User is successfully saved' });
  });
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
      .json({ msg: 'You have logged in successfully', email: user.email });
  } else {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
});

module.exports = router;
