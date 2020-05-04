const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME, // generated ethereal user
      pass: process.env.EMAIL_PASSWORD // generated ethereal password
    },
  });

  // verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

module.exports = transporter;