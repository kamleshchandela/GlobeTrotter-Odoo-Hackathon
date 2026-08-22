# My Itinerary 🌍✈️

**My Itinerary** is a premium, AI-powered travel planning and safety ecosystem designed specifically for travelers in India. It combines intelligent itinerary generation with a real-time safety network of verified local guardians and a comprehensive healthcare hub.

---

## 🌟 Key Features

### 🤖 AI-Powered Itineraries
Generate customized day-by-day plans based on your budget, travel vibe, and group size. Get real cost breakdowns and local insights for every destination.

### 🛡️ Guardian Network
Travel with peace of mind. Access a live, verified network of local residents in major Indian cities ready to assist solo travelers in moments of need. Includes a one-tap **Emergency SOS** system.

### 🏥 Healthcare Hub
Find verified clinics, English-speaking doctors, and specialized healthcare services across India. Book appointments and manage your medical travel profile seamlessly.

### 💎 Hidden Gems Discovery
Go beyond the tourist trail. Discover local-curated spots, offbeat festivals, and neighborhood food trails that you won't find in standard guidebooks.

### 🗺️ Interactive Maps
Full Google Maps integration to visualize your trip, find nearby hospitals, and track your verified guardian's location.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS (Premium Indian-themed palette)
- **UI Components:** shadcn/ui + Framer Motion (for smooth animations)
- **State Management:** Redux Toolkit (RTK)
- **Routing:** React Router 7
- **Forms:** React Hook Form + Zod Validation
- **SEO:** React Helmet Async + Sitemap & Robots.txt generation

### Integrations
- **Maps:** Google Maps JavaScript API (@react-google-maps/api)
- **Auth:** Google OAuth Integration
- **Notifications:** React Hot Toast
- **Icons:** Lucide React

---

## 📂 Project Structure

```text
src/
├── api/          # Axios configuration & interceptors
├── assets/       # Images, fonts, and static media
├── components/   # Reusable UI components & shared layouts
├── hooks/        # Custom React hooks (useAuth, useLocalStorage, etc.)
├── pages/        # Main application views (Home, Trips, Healthcare)
├── routes/       # Route configuration & protected route logic
├── store/        # Redux store & auth slices
└── utils/        # Helper functions & storage management
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/himmatmundhe07/my-itinerary.git
   ```
2. **Install dependencies:**
   ```bash
   cd my-itinerary/client
   npm install
   ```
3. **Environment Setup:**
   Create a `.env` file in the root and add your keys:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_key_here
   VITE_GOOGLE_CLIENT_ID=your_id_here
   VITE_API_URL=http://localhost:5000/api
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 👤 Author
**Himmat Mundhe**  
- [Portfolio](https://himmat-portfolio.vercel.app/)
- [LinkedIn](https://www.linkedin.com/in/himmat-mundhe-17b5a1213)
- [GitHub](https://github.com/himmatmundhe07)

---

## 📄 License
This project is for educational purposes as part of a Full Stack development task.
