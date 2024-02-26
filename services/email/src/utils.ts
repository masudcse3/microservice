/** @format */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false, // true for 465, false for other ports
});
const EMAIL_FROM = process.env.EMAIL_FROM || "localhost:587";
export const sendEmailTo = async ({ recepient, subject, body }) => {
  try {
    const { rejected } = await transporter.sendMail({
      from: `Microservice Practice <${EMAIL_FROM}>`,
      to: recepient,
      subject: subject,
      html: body,
    });
    if (rejected.length) {
      console.log("Email send Failed.", rejected);
    }
  } catch (error) {
    console.error(error);
  }
};
