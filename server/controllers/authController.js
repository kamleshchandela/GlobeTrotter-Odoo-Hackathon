import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../services/emailService.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user & Send OTP
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { 
      fullName, email, phone, password, 
      travelTypes, frequency, destinations, interests, 
      identity, emergencyContact, medicalInfo, locationEnabled 
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists and is verified' });
      }
      // If user exists but NOT verified, we can overwrite them or resend OTP.
      // For simplicity, we overwrite the data
      await User.deleteOne({ email });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Valid for 10 minutes
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const picture = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`;

    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      travelTypes,
      frequency,
      destinations,
      interests,
      identity,
      emergencyContact,
      medicalInfo,
      locationEnabled,
      otp,
      otpExpiry,
      picture
    });

    if (user) {
      // Send OTP via Email (free!)
      await sendOtpEmail(email, otp, fullName);

      res.status(201).json({
        message: 'User created successfully. OTP sent to your email.',
        userId: user._id,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const submittedOtp = String(otp).trim();
    const storedOtp = String(user.otp).trim();
    console.log(`[OTP CHECK] stored: "${storedOtp}" | submitted: "${submittedOtp}" | match: ${storedOtp === submittedOtp}`);

    if (storedOtp !== submittedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
      picture: user.picture
    });
  } catch (error) {
    console.error('[VERIFY-OTP ERROR]', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend OTP via email
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified' });
    }

    // Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send via email
    await sendOtpEmail(user.email, otp, user.fullName);

    res.json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    console.error('[RESEND-OTP ERROR]', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your phone number to login' });
      }

      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        token: generateToken(user._id),
        picture: user.picture
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user via Google
// @route   POST /api/auth/google
// @access  Public
export const authGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Fetch user details from Google directly with the access token
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) {
      return res.status(401).json({ message: 'Failed to verify Google token' });
    }
    
    const googleUser = await response.json();
    const { email, name, picture } = googleUser;

    let user = await User.findOne({ email });

    // If user doesn't exist, create them
    if (!user) {
      // Use a random secure string for Google users as password is required by model, but won't be used
      const generatedPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      user = await User.create({
        fullName: name,
        email,
        password: generatedPassword,
        phone: 'Google_' + Math.random().toString(36).slice(-6), // Dummy phone since it's required initially
        isVerified: true, // Google accounts are implicitly email verified
        picture,
      });
    } else {
      // If user exists but is not verified (maybe they started normal signup but never verified phone), verify them now since Google verified their email
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    // Detect if profile is incomplete (new Google user without preferences)
    const isProfileComplete = !!(user.travelTypes && user.travelTypes.length > 0);

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
      picture: user.picture || picture,
      isProfileComplete
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        picture: user.picture,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete profile for Google users
// @route   PUT /api/auth/complete-profile
// @access  Private
export const completeProfile = async (req, res) => {
  try {
    const {
      travelTypes, frequency, destinations, interests,
      identity, emergencyContact, medicalInfo, locationEnabled
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.travelTypes = travelTypes || user.travelTypes;
    user.frequency = frequency || user.frequency;
    user.destinations = destinations || user.destinations;
    user.interests = interests || user.interests;
    user.identity = identity || user.identity;
    user.emergencyContact = emergencyContact || user.emergencyContact;
    user.medicalInfo = medicalInfo || user.medicalInfo;
    user.locationEnabled = locationEnabled ?? user.locationEnabled;

    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      picture: user.picture,
      isProfileComplete: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile & preferences
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    const updatableFields = [
      'fullName', 'phone', 'dob', 'gender', 'city', 'bio', 'picture',
      'travelTypes', 'frequency', 'destinations', 'interests',
      'vibe', 'diet', 'accommodation', 'transport', 'languages',
      'safetySettings'
    ];

    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    // Return the updated user without sensitive fields
    const updatedUser = user.toObject();
    delete updatedUser.password;
    delete updatedUser.otp;
    delete updatedUser.otpExpiry;

    res.json(updatedUser);
  } catch (error) {
    console.error('[UPDATE PROFILE ERROR]', error);
    res.status(500).json({ message: error.message });
  }
};
