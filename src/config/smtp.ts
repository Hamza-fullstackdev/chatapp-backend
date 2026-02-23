import nodemailer from 'nodemailer';
import { config } from './env.config.js';

const transporter = nodemailer.createTransport({
  host: config.EMAIL_HOST,
  port: Number(config.EMAIL_PORT),
  secure: false,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  try {
    await transporter.sendMail({
      from: config.EMAIL_USER,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}
