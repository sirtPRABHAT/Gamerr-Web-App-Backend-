const nodemailer = require('nodemailer');
const catchAsync = require('../utils/catchAsync');

const sendEmail = async (options) => {
  // Define transporter
  const transporter = nodemailer.createTransport({
    // host: process.env.EMAIL_HOST,
    // port: process.env.EMAIL_PORT,
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASSWORD,
    // },
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'be5bfa5bd7bb83',
      pass: '90128333e32b8c',
    },
    // service: 'Gmail',
    // auth: {
    //   user: 'prabhat2000safi@gmail.com',
    //   pass: 'Safi@1201',
    // },
  });

  //Define mail options
  const mailOptions = {
    from: 'prabhat kumar <prabhat2000safi@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Actually send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
