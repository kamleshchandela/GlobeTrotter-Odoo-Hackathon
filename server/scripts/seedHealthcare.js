import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

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

const DOCTORS = [
  { 
    name: "Dr. Kavita Sharma", 
    qualification: "MBBS, MD", 
    specialty: "General Physician", 
    hospital: "Maharana Bhupal Hospital, Udaipur", 
    languages: ["Hindi", "English"], 
    distance: "0.8 km", 
    cost: "₹300–500", 
    rating: "4.7", 
    reviewsCount: "238", 
    experience: "12 yr",
    status: "open", 
    statusText: "OPEN NOW · CLOSES 7 PM", 
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80",
    about: "Dr. Kavita Sharma is a general physician...",
    phone: "+91 294 241 1535",
    address: "Maharana Bhupal Hospital, Chetak Circle, Udaipur",
    clinicHours: "Mon–Sat, 10 AM – 7 PM",
    hospitalType: "Government Hospital",
    badges: ["MCI Registration Verified", "ID Proof Submitted", "Hospital Affiliation Confirmed", "My Itinerary Verified"],
    reviews: [
      { name: "Priya M.", city: "Chennai", date: "2 weeks ago", rating: 5, tag: "Solo Traveler", body: "Dr. Sharma treated my food poisoning...", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" },
    ]
  },
  { name:"Dr. Arjun Reddy", qualification:"MBBS", specialty:"Emergency Medicine", hospital:"Global Hospital, Udaipur", languages:["Telugu","Hindi","English"], distance:"1.4 km", cost:"₹400–600", rating:"4.5", reviewsCount:"142", status:"open", statusText:"OPEN NOW", avatar:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80" },
  { name:"Dr. Sunita Joshi", qualification:"BDS, MDS", specialty:"Dental Surgeon", hospital:"Smile Dental Clinic, Udaipur", languages:["Hindi","English"], distance:"2.1 km", cost:"₹200–400", rating:"4.8", reviewsCount:"89", status:"open", statusText:"OPEN UNTIL 8 PM", avatar:"https://images.unsplash.com/photo-1594824476967-48c8b964ac31?auto=format&fit=crop&w=120&q=80" },
  { name:"Dr. Farhan Qureshi", qualification:"MBBS, DCH", specialty:"Pediatrician", hospital:"Child Care Clinic, Udaipur", languages:["Urdu","Hindi","English"], distance:"3.0 km", cost:"₹350–500", rating:"4.6", reviewsCount:"176", status:"closed", statusText:"CLOSED · OPENS 10 AM", avatar:"https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80" }
];

const HOSPITALS = [
  { 
    name: "Maharana Bhupal Hospital", 
    type: "Government", 
    specialty: "Multi-specialty Government Hospital", 
    address: "Chetak Circle, Udaipur, Rajasthan", 
    phone: "+91 294 241 1535", 
    emergencyPhone: "+91 294 241 1536",
    email: "info@mbh-udaipur.com",
    website: "mbhudaipur.nic.in",
    distance: "1.2 km", 
    photo: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    beds: "750",
    deptCount: "32+",
    about: "Maharana Bhupal Hospital is the primary government hospital in Udaipur.",
    departments: [
      { name: "Emergency Medicine", status: "24/7 Open", icon: "cross", color: "#C0392B" },
      { name: "Cardiology", status: "Mon–Sat, 9 AM–5 PM", icon: "heart", color: "#C0392B" },
      { name: "Pediatrics", status: "Mon–Sat, 10 AM–6 PM", icon: "baby", color: "#2D6A4F" },
      { name: "Orthopedics", status: "Mon–Fri, 10 AM–4 PM", icon: "bone", color: "#F0A500" },
    ],
    facilities: ["Blood Bank", "ICU", "Ambulance", "24/7 Pharmacy"],
    hours: [
      { day: "MON–SAT", time: "Outpatient: 10 AM – 5 PM" },
      { day: "EMERGENCY", time: "24 / 7", highlight: true },
    ],
    reviews: [
      { name: "Rohan K.", city: "Mumbai", date: "3 weeks ago", rating: 5, tag: "Tourist", body: "Visited the emergency...", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" },
    ]
  }
];

const PHARMACIES = [
  { name: "Apollo Pharmacy", address: "Chetak Circle, Near MB Hospital", hours: "24 Hours", status: "Open Now", distance: "0.2 km" },
  { name: "Wellness Forever", address: "Fatehpura Circle, Udaipur", hours: "24 Hours", status: "Open Now", distance: "1.4 km" },
  { name: "Generic Medicine Hub", address: "Hiran Magri, Udaipur", hours: "9 AM - 9 PM", status: "Open Now", distance: "3.2 km" },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Doctor.deleteMany();
    await Hospital.deleteMany();
    await Pharmacy.deleteMany();

    await Doctor.insertMany(DOCTORS);
    await Hospital.insertMany(HOSPITALS);
    await Pharmacy.insertMany(PHARMACIES);

    console.log('Data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
