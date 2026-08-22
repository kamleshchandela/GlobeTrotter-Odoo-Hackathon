import express from 'express';

const router = express.Router();

import { Hospital } from '../scripts/seedHealthcare.js';

// Fetch nearby hospitals by city/state query
router.get('/hospitals', async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const city = req.query.city || "Udaipur";
    const state = req.query.state || "Rajasthan";

    if (apiKey) {
      try {
        const query = encodeURIComponent(`hospitals in ${city} ${state}`);
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            return res.json(data.results.slice(0, 5));
          }
        }
      } catch (e) {
        console.warn("Google Places API failed, using database fallback...");
      }
    }

    // Database Fallback
    const localHospitals = await Hospital.find().limit(5);
    res.json(localHospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
