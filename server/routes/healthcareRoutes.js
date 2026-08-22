import express from 'express';

const router = express.Router();

const DOCTORS = [
  { 
    id: 1, 
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
    about: "Dr. Kavita Sharma is a general physician with 12 years of experience at Maharana Bhupal Hospital, Udaipur. She has extensive experience treating travelers including altitude sickness, food poisoning, heat exhaustion, and travel-related infections. She is fluent in Hindi and English and welcomes patients from all states and backgrounds.",
    phone: "+91 294 241 1535",
    address: "Maharana Bhupal Hospital, Chetak Circle, Udaipur",
    clinicHours: "Mon–Sat, 10 AM – 7 PM",
    hospitalType: "Government Hospital",
    badges: [
      "MCI Registration Verified",
      "ID Proof Submitted",
      "Hospital Affiliation Confirmed",
      "My Itinerary Verified"
    ],
    reviews: [
      { id: 1, name: "Priya M.", city: "Chennai", date: "2 weeks ago", rating: 5, tag: "Solo Traveler", body: "Dr. Sharma treated my food poisoning within 20 minutes of arriving. Exceptionally kind and thorough. Cost was exactly what was listed on My Itinerary. Felt completely safe as a solo woman traveler.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" },
      { id: 2, name: "Vikram T.", city: "Pune", date: "1 month ago", rating: 4, tag: "Tourist", body: "Quick appointment, clear diagnosis, and affordable. Only minor issue was a 20-minute wait. Doctor communicated clearly in English and explained the prescription properly.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" },
      { id: 3, name: "Aisha K.", city: "Delhi", date: "6 weeks ago", rating: 5, tag: "Solo Traveler", body: "I had altitude-related symptoms traveling through Rajasthan. Dr. Sharma was experienced with traveler conditions and prescribed the right medication immediately. The clinic was clean and well-organized.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80" }
    ]
  },
  { id:2, name:"Dr. Arjun Reddy", qualification:"MBBS", specialty:"Emergency Medicine", hospital:"Global Hospital, Udaipur", languages:["Telugu","Hindi","English"], distance:"1.4 km", cost:"₹400–600", rating:"4.5", reviewsCount:"142", status:"open", statusText:"OPEN NOW", avatar:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80" },
  { id:3, name:"Dr. Sunita Joshi", qualification:"BDS, MDS", specialty:"Dental Surgeon", hospital:"Smile Dental Clinic, Udaipur", languages:["Hindi","English"], distance:"2.1 km", cost:"₹200–400", rating:"4.8", reviewsCount:"89", status:"open", statusText:"OPEN UNTIL 8 PM", avatar:"https://images.unsplash.com/photo-1594824476967-48c8b964ac31?auto=format&fit=crop&w=120&q=80" },
  { id:4, name:"Dr. Farhan Qureshi", qualification:"MBBS, DCH", specialty:"Pediatrician", hospital:"Child Care Clinic, Udaipur", languages:["Urdu","Hindi","English"], distance:"3.0 km", cost:"₹350–500", rating:"4.6", reviewsCount:"176", status:"closed", statusText:"CLOSED · OPENS 10 AM", avatar:"https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80" },
];

const HOSPITALS = [
  { 
    id: 1, 
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
    about: "Maharana Bhupal Hospital is the primary government hospital in Udaipur, Rajasthan. Established in 1947, it serves as the main referral hospital for southern Rajasthan. The hospital offers free outpatient services for all patients and subsidized inpatient care. It has a well-equipped emergency department, a blood bank, and a 24/7 pharmacy. Travelers from outside Rajasthan are regularly treated here and the hospital has English-speaking staff in the emergency department.",
    departments: [
      { name: "Emergency Medicine", status: "24/7 Open", icon: "cross", color: "#C0392B" },
      { name: "Cardiology", status: "Mon–Sat, 9 AM–5 PM", icon: "heart", color: "#C0392B" },
      { name: "Pediatrics", status: "Mon–Sat, 10 AM–6 PM", icon: "baby", color: "#2D6A4F" },
      { name: "Orthopedics", status: "Mon–Fri, 10 AM–4 PM", icon: "bone", color: "#F0A500" },
      { name: "Ophthalmology", status: "Mon–Sat, 9 AM–1 PM", icon: "eye", color: "#E8640C" },
      { name: "General Medicine", status: "Mon–Sat, 10 AM–7 PM", icon: "steth", color: "#2D6A4F" },
      { name: "Dental", status: "Mon–Fri, 10 AM–5 PM", icon: "tooth", color: "#B09880" },
      { name: "Pathology Lab", status: "24/7 Open", icon: "flask", color: "#F0A500" }
    ],
    facilities: [
      "Blood Bank", "ICU", "Ambulance", "24/7 Pharmacy", "Radiology", "Operation Theatres", "Dialysis", "Canteen", "Parking", "Wheelchair Access", "Free OPD"
    ],
    hours: [
      { day: "MON–SAT", time: "Outpatient: 10 AM – 5 PM" },
      { day: "SUNDAY", time: "Emergency only" },
      { day: "EMERGENCY", time: "24 / 7", highlight: true },
      { day: "PHARMACY", time: "24 / 7" },
      { day: "LABORATORY", time: "8 AM – 8 PM" }
    ],
    reviews: [
      { id: 1, name: "Rohan K.", city: "Mumbai", date: "3 weeks ago", rating: 5, tag: "Tourist", body: "Visited the emergency department after a road accident outside Udaipur. The response was fast, the doctor spoke English clearly, and the treatment was thorough. As a government hospital, the care was genuinely good — better than I expected.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" },
      { id: 2, name: "Anjali S.", city: "Bengaluru", date: "2 months ago", rating: 4, tag: "Solo Traveler", body: "Had food poisoning and was treated quickly. The OPD was well-organized. Waiting time was about 40 minutes but the consultation itself was detailed. Free of charge for the OPD visit.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80" }
    ]
  }
];

const PHARMACIES = [
  { id: 1, name: "Apollo Pharmacy", address: "Chetak Circle, Near MB Hospital", hours: "24 Hours", status: "Open Now", distance: "0.2 km" },
  { id: 2, name: "Wellness Forever", address: "Fatehpura Circle, Udaipur", hours: "24 Hours", status: "Open Now", distance: "1.4 km" },
  { id: 3, name: "Generic Medicine Hub", address: "Hiran Magri, Udaipur", hours: "9 AM - 9 PM", status: "Open Now", distance: "3.2 km" },
];

// GET all doctors
router.get('/doctors', (req, res) => {
  res.json(DOCTORS);
});

// GET all hospitals
router.get('/hospitals', (req, res) => {
  res.json(HOSPITALS);
});

// GET all pharmacies
router.get('/pharmacies', (req, res) => {
  res.json(PHARMACIES);
});

export default router;
