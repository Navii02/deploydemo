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
    user: 'capcepoonjar@gmail.com',
    pass: 'qhcx uctk krbk ggeu',
  },
});

module.exports = emailTransporter;
