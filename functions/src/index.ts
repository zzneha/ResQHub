import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

interface EmailData {
  toName: string;
  toEmail: string;
  googleFormUrl: string;
}

// Configure the email transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendVolunteerEmail = functions.https.onCall(async (request: functions.https.CallableRequest<EmailData>) => {
  const { toName, toEmail, googleFormUrl } = request.data;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Complete Your Volunteer Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for registering as a volunteer!</h2>
        <p>Dear ${toName},</p>
        <p>We're excited to have you join our volunteer community. To complete your registration, please fill out our detailed questionnaire by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${googleFormUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Complete Questionnaire
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p>${googleFormUrl}</p>
        <p>Best regards,<br>ResqHub Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
}); 