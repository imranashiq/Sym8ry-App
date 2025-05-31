const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to || typeof to !== "string" || to.trim() === "") {
      throw new Error("No recipient defined");
    }

    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.FROM_EMAIL_ADDRESS,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let info = await transporter.sendMail({
      from: `"Sym8ry Fitness" <${process.env.FROM_EMAIL_ADDRESS}>`,
      to,
      subject,
      html,
    });

    // console.log("Email sent:", info);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
