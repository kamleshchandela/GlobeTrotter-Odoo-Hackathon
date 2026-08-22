import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: String,
  qualification: String,
  specialty: String,
  hospital: String,
  languages: [String],
  distance: String,
  cost: String,
  rating: String,
  reviewsCount: String,
  experience: String,
  status: String,
  statusText: String,
  avatar: String,
  about: String,
  phone: String,
  address: String,
  clinicHours: String,
  hospitalType: String,
  badges: [String],
  reviews: Array
});

const hospitalSchema = new mongoose.Schema({
  name: String,
  type: String,
  specialty: String,
  address: String,
  phone: String,
  emergencyPhone: String,
  email: String,
  website: String,
  distance: String,
  photo: String,
  beds: String,
  deptCount: String,
  about: String,
  departments: Array,
  facilities: Array,
  hours: Array,
  reviews: Array
});

const pharmacySchema = new mongoose.Schema({
  name: String,
  address: String,
  hours: String,
  status: String,
  distance: String
});

export const Doctor = mongoose.model('Doctor', doctorSchema);
export const Hospital = mongoose.model('Hospital', hospitalSchema);
export const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);
