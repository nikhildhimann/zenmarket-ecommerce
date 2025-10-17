import nodemailer from "nodemailer";

// Create a transporter for SMTP
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 2525,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
