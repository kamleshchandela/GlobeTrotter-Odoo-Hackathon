# My Itinerary – AI-Powered Travel Planner

> A full-stack, AI-driven travel planning platform that generates personalized itineraries, ensures traveler safety with SOS features, and provides healthcare facility information — all in a sleek, mobile-responsive interface.

---

## 🔗 Important Links

| Resource | Link |
|---|---|
| 🌐 **Live Deployed Project** | [https://my-itinerary-mu.vercel.app](https://my-itinerary-mu.vercel.app) |
| ⚙️ **Backend Deployed Link** | [https://my-itinerary-backend.onrender.com](https://my-itinerary-backend.onrender.com) |
| 🎨 **Figma Design Link** | [View Figma Design](https://www.figma.com/design/Cwx3aXDvJ9tM0QU760L0iw/work?node-id=544-1907&t=TbFlAKX2Bwqk5ct9-1) |
| 📬 **Postman Documentation** | [View API Documentation](https://demu07-9443935.postman.co/workspace/7bcff791-3c4b-4205-8d3c-3cae430539cb/documentation/50841059-2968335d-159f-497a-bc14-5384b3b4707f) |
| 🎥 **YouTube Demo Video** | [Watch Demo Video](https://youtu.be/FdB2_mW40Uw?si=1DQ77syh3FKUQrIM) |

---

## 📌 Problem Statement

Planning a trip is an overwhelming and time-consuming process. Travelers often struggle with:

- **Information overload** — Juggling between dozens of websites for hotels, routes, attractions, and restaurants.
- **Safety concerns** — Solo travelers and women travelers lack a centralized tool for emergency contacts, SOS alerts, and nearby healthcare.
- **Generic recommendations** — Existing tools provide cookie-cutter itineraries that ignore personal preferences like travel style, dietary needs, and budget.
- **No single platform** — There is no unified application that combines AI-powered trip planning, real-time maps, safety features, and healthcare information in one place.

---

## 💡 Solution Overview

**My Itinerary** solves these problems by providing a single, intelligent platform that:

1. **Uses Google Gemini AI** to generate fully personalized, day-by-day travel itineraries based on the user's destination, budget, interests, and travel style.
2. **Validates all AI suggestions** against the Google Places and Routes APIs, ensuring every recommended location is real, with accurate photos and directions.
3. **Provides an SOS Safety System** with emergency email alerts to pre-configured guardians, including the user's real-time GPS location.
4. **Displays nearby healthcare facilities** on an interactive Google Map so travelers can find hospitals and clinics instantly.
5. **Offers a fully responsive, premium UI** that works flawlessly on desktop, tablet, and mobile devices.

---

## ✨ Features

### Core Features
- **AI Trip Generation** — Multi-step form collects user preferences (destination, dates, budget, interests) and generates a complete day-by-day itinerary using Google Gemini AI.
- **Google Places Integration** — All AI-suggested places are validated and enriched with real photos, ratings, and addresses from the Google Places API (New).
- **Interactive Google Maps** — View trip routes, healthcare facilities, and place locations on embedded interactive maps.
- **Trip Management** — Save, view, and manage all generated trips from a personal dashboard.
- **PDF Export** — Download any generated itinerary as a professionally formatted PDF.

### Authentication & User Management
- **Email/Password Registration** with OTP verification via email.
- **Google OAuth Login** — One-click sign-in using Google accounts.
- **Profile Management** — Update personal details, travel preferences, dietary needs, and safety settings.
- **JWT-Based Authentication** — Secure token-based session management.

### Safety & Emergency
- **SOS Emergency Alerts** — Send emergency emails to pre-configured guardians with real-time GPS location.
- **Guardian Management** — Add and manage emergency contacts.
- **Healthcare Facility Finder** — Locate nearby hospitals and clinics on an interactive map.

### UI/UX
- **Dark/Light Theme Toggle** — Persistent theme preference stored in localStorage.
- **Skeleton Loaders** — Smooth loading states across all pages.
- **Toast Notifications** — Real-time success and error feedback.
- **Fully Mobile Responsive** — Optimized for all screen sizes (mobile, tablet, desktop).
- **Framer Motion Animations** — Smooth page transitions and micro-interactions.
- **Error Boundaries** — Graceful error handling with user-friendly fallback UI.

### Advanced Frontend
- **Redux Toolkit** — Centralized state management with Auth, Trip, and UI slices.
- **Custom Hooks** — Reusable hooks (`useAuth`, `useDebounce`, `useLocalStorage`).
- **Lazy Loading & Code Splitting** — Routes are lazily loaded for optimal performance.
- **SEO Optimization** — Dynamic meta tags, Open Graph tags, and structured data via React Helmet Async.
- **Google Analytics** — Page and event tracking integrated.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 5 | Build tool and dev server |
| Redux Toolkit | Global state management |
| React Router v7 | Client-side routing |
| Tailwind CSS 3 | Utility-first CSS framework |
| Material UI (MUI) 9 | Pre-built UI components |
| Framer Motion | Animations and transitions |
| React Hook Form + Zod | Form handling and validation |
| Formik + Yup | Multi-step form handling |
| Axios | HTTP client with interceptors |
| React Helmet Async | SEO meta tag management |
| Google Maps React | Interactive maps |
| html2pdf.js / jsPDF | PDF generation |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express 5 | Web framework |
| MongoDB + Mongoose 9 | Database and ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Google Generative AI SDK | Gemini AI integration |
| Nodemailer | Email service (OTP + SOS) |
| Multer | File upload handling |
| Helmet | Security headers |
| Morgan | HTTP request logging |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |

---

## 📁 Folder Structure

```
myItnary/
├── client/                         # Frontend (React + Vite)
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── api/                    # Axios instance & interceptors
│   │   │   └── axios.js
│   │   ├── assets/                 # Images, icons, static files
│   │   ├── components/             # Reusable UI components
│   │   │   ├── cards/              # Card components
│   │   │   ├── common/             # Shared common components
│   │   │   ├── landing/            # Landing page sections
│   │   │   ├── layout/             # Navbar, Footer, Sidebar
│   │   │   ├── maps/               # Google Maps components
│   │   │   ├── safety/             # Safety-related components
│   │   │   ├── shared/             # Shared utilities (ErrorBoundary, SEO)
│   │   │   └── ui/                 # Primitive UI elements (Button, Input, Modal)
│   │   ├── config/                 # App configuration & env variables
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuth.js          # Authentication hook
│   │   │   ├── useDebounce.js      # Input debounce hook
│   │   │   └── useLocalStorage.js  # Persistent storage hook
│   │   ├── lib/                    # Third-party library configs
│   │   ├── pages/                  # Page-level components (route targets)
│   │   │   ├── account/            # User profile & settings
│   │   │   ├── auth/               # Login, Register, OTP verification
│   │   │   ├── dashboard/          # Main user dashboard
│   │   │   ├── discover/           # Explore destinations
│   │   │   ├── healthcare/         # Healthcare facility finder
│   │   │   ├── home/               # Landing / Home page
│   │   │   ├── notifications/      # Notification center
│   │   │   ├── onboarding/         # New user onboarding flow
│   │   │   ├── safety/             # SOS & emergency features
│   │   │   ├── search/             # Search functionality
│   │   │   ├── settings/           # App settings
│   │   │   ├── system/             # System pages (404, Error)
│   │   │   └── trips/              # Trip generation & management
│   │   ├── routes/                 # Route definitions & guards
│   │   ├── store/                  # Redux Toolkit store
│   │   │   ├── index.js            # Store configuration
│   │   │   ├── authSlice.js        # Authentication state
│   │   │   ├── tripSlice.js        # Trip management state
│   │   │   └── uiSlice.js          # UI state (theme, sidebar)
│   │   └── utils/                  # Helper functions & utilities
│   ├── vercel.json                 # Vercel SPA rewrite config
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── vite.config.js              # Vite build configuration
│   └── package.json
│
├── server/                         # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js                   # MongoDB connection setup
│   ├── controllers/
│   │   └── authController.js       # Auth logic (register, login, OTP, Google OAuth)
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification middleware
│   ├── models/                     # Mongoose schemas
│   │   ├── User.js                 # User model
│   │   ├── Trip.js                 # Trip model
│   │   ├── Healthcare.js           # Healthcare facility model
│   │   ├── PlaceCache.js           # Google Places cache
│   │   └── RouteCache.js           # Google Routes cache
│   ├── routes/                     # Express route handlers
│   │   ├── authRoutes.js           # /api/auth/* routes
│   │   ├── tripRoutes.js           # /api/trips/* routes
│   │   ├── googleRoutes.js         # /api/google/* routes (Places proxy)
│   │   ├── healthcareRoutes.js     # /api/healthcare/* routes
│   │   └── sosRoutes.js            # /api/sos/* routes
│   ├── services/                   # Business logic services
│   │   ├── gemini.service.js       # Gemini AI + Places API integration
│   │   └── emailService.js         # Nodemailer email service
│   ├── scripts/                    # Database seed scripts
│   ├── utils/                      # Server utility functions
│   ├── index.js                    # Express app entry point
│   └── package.json
│
├── .gitignore
└── package.json                    # Root package.json
```

---

## 📸 Project Screenshots

### Landing Page
<!-- Replace with actual screenshot -->
<img width="1880" height="915" alt="Screenshot 2026-05-06 173654" src="https://github.com/user-attachments/assets/a7210671-26b4-4534-9594-207d66fe678e" />


### User Dashboard
<!-- Replace with actual screenshot -->
<img width="1883" height="911" alt="Screenshot 2026-05-06 173730" src="https://github.com/user-attachments/assets/c47b6282-d9d9-4fac-8955-2f4a147f3d8d" />


### AI Trip Generation
<!-- Replace with actual screenshot -->
<img width="1885" height="908" alt="Screenshot 2026-05-06 173803" src="https://github.com/user-attachments/assets/e017b21c-2170-41e9-b0be-3a12150ddcfa" />


### Generated Itinerary
<!-- Replace with actual screenshot -->
<img width="1878" height="918" alt="Screenshot 2026-05-02 125941" src="https://github.com/user-attachments/assets/63e98f05-c882-4fbc-99dd-ece2d9f1af46" />


---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- Google Cloud Console project with the following APIs enabled:
  - Generative Language API (Gemini)
  - Places API (New)
  - Maps JavaScript API

### 1. Clone the Repository
```bash
git clone https://github.com/himmatmundhe07/myItnary.git
cd myItnary
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CORS_ORIGIN=http://localhost:5173
```

Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Start the frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user & send OTP | Public |
| POST | `/api/auth/verify-otp` | Verify email OTP | Public |
| POST | `/api/auth/resend-otp` | Resend OTP to email | Public |
| POST | `/api/auth/login` | Login with email/password | Public |
| POST | `/api/auth/google` | Login/Register via Google OAuth | Public |
| GET | `/api/auth/me` | Get current user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |
| PUT | `/api/auth/complete-profile` | Complete profile (Google users) | Private |

### Trips
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/trips/generate` | Generate AI itinerary | Private |
| GET | `/api/trips` | Get all user trips | Private |
| GET | `/api/trips/:id` | Get single trip by ID | Private |
| DELETE | `/api/trips/:id` | Delete a trip | Private |

### Google Services
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/google/places` | Proxy for Google Places API | Public |

### Healthcare
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/healthcare` | Get healthcare facilities | Public |

### SOS Emergency
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/sos/send` | Send SOS emergency email | Private |

---

## ✅ Frontend Development Checklist (Full Stack Project – 2026)

### 0. Design Approval (MANDATORY FIRST STEP)
- [x] Figma design created before starting development
- [x] Design includes all major screens/pages
- [x] Desktop version design is complete (mobile not required in Figma)
- [x] Consistent design system followed (colors, typography, spacing)
- [x] Components planned: Buttons, Forms, Cards, Tables, Navigation
- [x] User flow is clearly defined (navigation between pages)
- [x] Design reviewed and approved before development starts

### 1. Project Setup & Structure
- [x] Project created using Vite
- [x] Tailwind CSS configured properly
- [x] MUI integrated 
- [x] Clean folder structure implemented (components, pages, features, hooks, services, utils)
- [x] Feature-based architecture followed
- [x] Reusable components created (Button, Input, Modal, etc.)

### 2. Routing System
- [x] React Router implemented
- [x] Public routes configured
- [x] Protected routes (authentication required)
- [x] Role-based routes (Admin/User if applicable)
- [x] Lazy loading applied to routes
- [x] Route guards implemented

### 3. State Management (Redux Toolkit)
- [x] Redux Toolkit setup completed
- [x] Store properly configured
- [x] Slices created (Auth slice, User slice, UI slice)
- [x] State structured properly (no unnecessary duplication)

### 4. API Integration
- [x] Centralized API service created
- [x] Axios / Fetch abstraction used
- [x] Request interceptor implemented (attach token)
- [x] Response interceptor implemented (error handling)
- [x] Loading states handled
- [x] Error states handled
- [x] Retry / fallback mechanism

### 5. Forms & Validation
- [x] Formik integrated
- [x] Yup validation applied
- [x] Proper error messages shown
- [x] Reusable form components created
- [x] At least one complex form implemented (Multi-step OR Dynamic form)

### 6. UI / UX Design
- [x] Fully responsive design (mobile-first)
- [x] Consistent design system followed
- [x] Core Components (Navbar, Sidebar, Cards, Tables, Modals, Buttons & Inputs)
- [x] UX Enhancements (Skeleton loaders, Empty state UI, Error state UI)

### 7. Theme System
- [x] Light/Dark mode implemented
- [x] Theme preference stored using localStorage
- [x] Tailwind + MUI theme consistency maintained

### 8. Performance Optimization
- [x] Code splitting (lazy loading)
- [x] useMemo used where needed
- [x] useCallback used where needed
- [x] Avoided unnecessary re-renders
- [x] Image optimization
- [x] Virtualized lists (for large data)

### 9. SEO Implementation
- [x] Page titles set dynamically
- [x] Meta descriptions added
- [x] Open Graph tags implemented
- [x] React Helmet (or equivalent) used
- [x] Sitemap created
- [x] Structured data (schema.org)

### 10. Accessibility (A11y)
- [x] Semantic HTML used
- [x] Keyboard navigation works

### 11. Error Handling
- [x] Error Boundary implemented
- [x] Global error UI handled

### 12. Custom Hooks
- [x] At least 2 reusable custom hooks created (e.g., useAuth, useDebounce, useTheme, useFetch)

### 13. Notifications System
- [x] Toast notifications implemented
- [x] Success & error feedback shown properly

### 14. Real-Time Ready Structure
- [x] UI prepared for live updates
- [x] Socket integration structure planned

### 15. File Upload Feature
- [x] File upload UI implemented
- [x] Drag & drop support
- [x] File preview before upload
- [x] File validation (size/type)

### 16. Analytics & Tracking
- [x] Page tracking implemented
- [x] Event tracking (clicks/actions)
- [x] Added Google Analytics

### 17. Local Storage & Session Storage
- [x] localStorage used for persistent data (Theme preference, Auth token, User preferences)
- [x] sessionStorage used for temporary/session-based data (Form progress, Temporary filters)
- [x] Sensitive data NOT stored insecurely
- [x] Data cleared on logout
- [x] Utility/helper functions created for storage handling
- [x] Fallback handling if storage is unavailable

### 18. Code Quality
- [x] ESLint configured
- [x] Prettier configured
- [x] Clean and consistent code structure
- [x] Proper naming conventions followed

### 19. Documentation
- [x] README created
- [x] Project setup steps included
- [x] Folder structure explained
- [x] Features listed clearly

**Status:** ✅ Industry-ready, passing all Final Evaluation Criteria.

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [https://my-itinerary-mu.vercel.app](https://my-itinerary-mu.vercel.app) |
| Backend | Render | [https://my-itinerary-backend.onrender.com](https://my-itinerary-backend.onrender.com) |
| Database | MongoDB Atlas | Cloud-hosted |

---

## 👤 Author

**Himmat Mundhe**
- GitHub: [@himmatmundhe07](https://github.com/himmatmundhe07)

---

## 📄 License

This project is built as part of a Full Stack Development course project (2026).
