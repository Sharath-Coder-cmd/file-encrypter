const mail = require("nodemailer");

const sendMail = async (mailId, subject, text) => {
  const transport = mail.createTransport({
    service: "gmail",
    host: "smtp.gmail.com", 
    port: 465, 
    secure: true, 
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: process.env.GMAIL,
      to: mailId,
      subject,
      text,
    });
    console.log("Email Sent Successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error(error.message);
  }
};

module.exports = sendMail;
