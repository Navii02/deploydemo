const express = require('express');
const app = express();
const StudentData = require('../models/Student/StudentData');
const emailTransporter = require('../../back/nodemailer');




app.post("/send-email", (req, res) => {
  const { student } = req.body;
  const { email, name } = student;


  // Email content
  const mailOptions = {
    from:  emailTransporter.options.auth.user,
    to: email,
    subject: "Payment Reminder",
    text: `Dear ${name},\n\nThis is to remind you that your fee payment is pending. Please make the necessary payment as soon as possible.\n\nThank you.\n\nSincerely,\nYour Institution`,
  };

  // Send the email
  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ message: "Email sent successfully" });
    }
  });
});
app.get("/students", async (req, res) => {
    const student = await StudentData.find();
    res.json(student);

  });
module.exports =app  
