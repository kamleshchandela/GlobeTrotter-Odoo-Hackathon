import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Step 1: Basic Info
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }, // dialCode + phone
  password: { type: String, required: true },
  
  // Verification
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },
  picture: { type: String },

  // Additional Profile Info
  dob: { type: String },
  gender: { type: String },
  city: { type: String },
  bio: { type: String },

  // Step 2: Preferences
  travelTypes: [{ type: String }],
  frequency: { type: String },
  destinations: [{ type: String }],
  interests: [{ type: String }],
  vibe: { type: String },
  diet: { type: String },
  accommodation: { type: String },
  transport: { type: String },
  languages: [{ type: String }],

  // Step 3: Safety
  identity: { type: String },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
    email: { type: String }
  },
  medicalInfo: { type: String },
  locationEnabled: { type: Boolean, default: false },
  
  // Default Safety Settings
  safetySettings: {
    womenOnly: { type: Boolean, default: true },
    realTimeAlerts: { type: Boolean, default: true },
    shareLocation: { type: Boolean, default: true },
    offlineGuide: { type: Boolean, default: false }
  },

}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
