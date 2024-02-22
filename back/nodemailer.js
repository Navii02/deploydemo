const nodemailer = require('nodemailer');

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cepoonjar11@gmail.com',
    pass: 'toru djrh nzxy erhn',
  },
});

module.exports = emailTransporter;
