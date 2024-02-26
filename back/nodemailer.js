const nodemailer = require('nodemailer');
/*const emailTransporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'donavon.okon@ethereal.email',
      pass: 'mPPAewvCuwr4Rqsz6e'
  }
});*/
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cepoonjar11@gmail.com',
    pass: 'toru djrh nzxy erhn',
  },
});

module.exports = emailTransporter;
