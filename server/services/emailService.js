import nodemailer from 'nodemailer';

// Create transporter LAZILY (inside function) so env vars are available
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    console.log('[EMAIL] Initializing with user:', process.env.EMAIL_USER);
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

/**
 * Send OTP to user's email — completely free via Gmail SMTP
 */
export const sendOtpEmail = async (toEmail, otp, userName) => {
  const mailOptions = {
    from: `"My Itinerary" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${otp} is your My Itinerary verification code`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #FFF8F0; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1E1410; font-size: 24px; margin: 0;">My Itinerary</h1>
          <p style="color: #6B4F3A; font-size: 13px; margin-top: 4px;">Safe travels across India</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 28px; border: 1px solid #E8D5B7;">
          <p style="color: #1E1410; font-size: 16px; margin: 0 0 8px;">Hi ${userName || 'Traveler'},</p>
          <p style="color: #6B4F3A; font-size: 14px; margin: 0 0 24px;">Here is your verification code:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #E8640C; background: #FEF3E2; padding: 12px 24px; border-radius: 10px; border: 2px dashed #E8640C; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="color: #B09880; font-size: 12px; text-align: center; margin: 24px 0 0;">
            This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
          </p>
        </div>
        <p style="color: #B09880; font-size: 11px; text-align: center; margin-top: 20px;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const t = getTransporter();
    const info = await t.sendMail(mailOptions);
    console.log(`[EMAIL OK] OTP ${otp} sent to ${toEmail} (messageId: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error('[EMAIL ERROR]', error.message);
    console.log(`[EMAIL FALLBACK] OTP ${otp} for ${toEmail}`);
    return false;
  }
};
