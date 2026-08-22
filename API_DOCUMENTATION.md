# My Itinerary API Documentation

This document outlines all the available backend endpoints for the My Itinerary application.

## Base URL
All endpoints are relative to: `http://localhost:5000/api` (or your configured production domain).

## Authentication
Endpoints marked as **Protected** require a valid JWT token sent in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token_here>
```

---

## 1. Authentication & Profile (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Expected Body / Query |
| :--- | :--- | :--- | :---: | :--- |
| **POST** | `/register` | Register a new user | ❌ | `{ fullName, email, password, phone }` |
| **POST** | `/verify-otp` | Verify email OTP | ❌ | `{ email, otp }` |
| **POST** | `/login` | Login with email & password | ❌ | `{ email, password }` |
| **POST** | `/google` | Login/Register via Google | ❌ | Google Auth token details |
| **POST** | `/resend-otp` | Resend verification OTP | ❌ | `{ email }` |
| **GET** | `/me` | Get current user's profile | ✅ | *None* |
| **PUT** | `/complete-profile` | Complete onboarding profile | ✅ | Profile fields (e.g., preferences) |
| **PUT** | `/profile` | Update existing profile | ✅ | Profile fields to update |

---

## 2. Trips & Itineraries (`/api/trips`)

| Method | Endpoint | Description | Auth Required | Expected Body / Query |
| :--- | :--- | :--- | :---: | :--- |
| **POST** | `/generate` | Generate AI itinerary via Gemini | ❌ | `{ location, duration, startDate, budget, etc. }` |
| **POST** | `/save` | Save a generated trip to database | ✅ | Full trip JSON object |
| **GET** | `/` | Get all saved trips for the user | ✅ | *None* |
| **GET** | `/:id` | Get a specific trip by its ID | ✅ | *None* |

---

## 3. Safety & SOS (`/api/sos`)

| Method | Endpoint | Description | Auth Required | Expected Body / Query |
| :--- | :--- | :--- | :---: | :--- |
| **POST** | `/trigger` | Send SOS Email with location and media | ✅ | `FormData`: `latitude`, `longitude`, `frontPhoto`, `backPhoto`, `audioClip` |
| **GET** | `/contact` | Get user's emergency contact details | ✅ | *None* |
| **PUT** | `/contact` | Update emergency contact details | ✅ | `{ name, phone, email }` |

---

## 4. Healthcare (`/api/healthcare`)

| Method | Endpoint | Description | Auth Required | Expected Body / Query |
| :--- | :--- | :--- | :---: | :--- |
| **GET** | `/doctors` | Get verified local doctors | ❌ | *None* |
| **GET** | `/hospitals` | Get verified local hospitals | ❌ | *None* |
| **GET** | `/pharmacies` | Get 24/7 pharmacies | ❌ | *None* |

---

## 5. Google Maps Integration (`/api/google`)

| Method | Endpoint | Description | Auth Required | Expected Body / Query |
| :--- | :--- | :--- | :---: | :--- |
| **GET** | `/hospitals` | Search live hospitals via Google Places | ❌ | `?city=String&state=String` |
