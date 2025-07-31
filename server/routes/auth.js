const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// OTP generation and sending
router.post('/send-otp', async (req, res) => {
  const { email, phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  try {
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    
    if (!user) {
      user = new User({ email, phone });
    }
    
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    if (email) {
      // Send email OTP
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
        text: `Your OTP is: ${otp}`,
        html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
      });
    } else if (phone) {
      // Send SMS OTP
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your Anshika's World OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    }

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
});

// OTP verification
router.post('/verify-otp', async (req, res) => {
  const { email, phone, otp } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phone }] })
      .select('+otp +otpExpires');
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ success: true, token, isAdult: user.isAdult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
});

// Age verification
router.post('/verify-age', async (req, res) => {
  const { isAdult } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isAdult = isAdult;
    await user.save();

    res.json({ success: true, isAdult: user.isAdult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating age verification' });
  }
});

module.exports = router;