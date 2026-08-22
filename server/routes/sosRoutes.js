import express from 'express';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Multer stores files in memory (for email attachments)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST /api/sos/trigger
router.post('/trigger', protect, upload.fields([
  { name: 'frontPhoto', maxCount: 1 },
  { name: 'backPhoto', maxCount: 1 },
  { name: 'audioClip', maxCount: 1 }
]), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const emergencyEmail = user.emergencyContact?.email;
    if (!emergencyEmail) {
      return res.status(400).json({ message: 'No emergency contact email configured. Please update your profile.' });
    }

    const { latitude, longitude } = req.body;
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Build email attachments from uploaded files
    const attachments = [];
    if (req.files?.frontPhoto?.[0]) {
      attachments.push({ filename: 'front_camera.jpg', content: req.files.frontPhoto[0].buffer });
    }
    if (req.files?.backPhoto?.[0]) {
      attachments.push({ filename: 'rear_camera.jpg', content: req.files.backPhoto[0].buffer });
    }
    if (req.files?.audioClip?.[0]) {
      attachments.push({ filename: 'voice_recording.webm', content: req.files.audioClip[0].buffer });
    }

    const mailOptions = {
      from: `"My Itinerary SOS" <${process.env.EMAIL_USER}>`,
      to: emergencyEmail,
      subject: `🚨 SOS ALERT from ${user.fullName}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #FFF8F0; border: 2px solid #C0392B; border-radius: 16px; overflow: hidden;">
          <div style="background: #C0392B; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🚨 EMERGENCY SOS ALERT</h1>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 16px; color: #1E1410; margin-bottom: 8px;">
              <strong>${user.fullName}</strong> has triggered an SOS emergency alert from the My Itinerary app.
            </p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr><td style="padding: 8px; font-weight: bold; color: #6B4F3A;">Time</td><td style="padding: 8px;">${timestamp}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #6B4F3A;">Phone</td><td style="padding: 8px;">${user.phone || 'Not set'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #6B4F3A;">Location</td><td style="padding: 8px;"><a href="${mapsLink}" style="color: #E8640C; font-weight: bold;">View on Google Maps</a></td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #6B4F3A;">Coordinates</td><td style="padding: 8px;">${latitude}, ${longitude}</td></tr>
            </table>
            ${attachments.length > 0 ? '<p style="font-size: 14px; color: #6B4F3A; margin-top: 16px;">📎 Camera photos and/or voice recording are attached to this email.</p>' : ''}
            <div style="margin-top: 24px; padding: 16px; background: #C0392B12; border-radius: 8px; border-left: 4px solid #C0392B;">
              <p style="margin: 0; font-size: 14px; color: #C0392B; font-weight: bold;">Please contact ${user.fullName} immediately or call local emergency services.</p>
            </div>
          </div>
          <div style="background: #F5EDE0; padding: 12px; text-align: center;">
            <p style="margin: 0; font-size: 11px; color: #B09880;">Sent via My Itinerary Safety System</p>
          </div>
        </div>
      `,
      attachments
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SOS] Alert sent to ${emergencyEmail} for user ${user.fullName}`);
    res.json({ message: 'SOS alert sent successfully to your emergency contact.' });
  } catch (error) {
    console.error('[SOS ERROR]', error);
    res.status(500).json({ message: 'Failed to send SOS alert. Please call emergency services directly: 112' });
  }
});

// GET /api/sos/contact — fetch emergency contact for current user
router.get('/contact', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('emergencyContact');
    res.json(user?.emergencyContact || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/sos/contact — update emergency contact
router.put('/contact', protect, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user._id);
    user.emergencyContact = { name, phone, email };
    await user.save();
    res.json({ message: 'Emergency contact updated', emergencyContact: user.emergencyContact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
