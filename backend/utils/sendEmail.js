import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // or "Outlook", "Yahoo"
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: `"HealWise" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text
  });
}
