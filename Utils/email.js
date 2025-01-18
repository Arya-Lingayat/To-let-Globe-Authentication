const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1) Creating a transporter
  console.log(options);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 2525,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) Defining the email options
  const mailOPtions = {
    from: "Testing ",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3) Actually send the email
  await transporter.sendMail(mailOPtions);
};

module.exports = sendEmail;
