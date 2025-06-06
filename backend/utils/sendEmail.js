const nodemailer = require("nodemailer");
const mailSender = async ({ email, title, body }) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });


    let info = await transporter.sendMail({
      from: "HELTH-PRO - Healthcare Services",
      to: email,
      subject: title,
      html: body,
    });

    return info;
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = mailSender;
