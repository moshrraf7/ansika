const twilio = require('twilio');
const nodemailer = require('nodemailer');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Email
const sendEmailOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: 'Your OTP for Anshika\'s World',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #EC4899;">Your Verification Code</h2>
        <p>Use the following OTP to verify your account:</p>
        <div style="background: #FCE7F3; padding: 10px 15px; display: inline-block; 
                    border-radius: 5px; font-size: 24px; font-weight: bold; color: #DB2777;">
          ${otp}
        </div>
        <p style="margin-top: 20px;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
};

// Send OTP via SMS
const sendSMSOTP = async (phone, otp) => {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({
    body: `Your Anshika's World verification code: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
};

module.exports = { generateOTP, sendEmailOTP, sendSMSOTP };