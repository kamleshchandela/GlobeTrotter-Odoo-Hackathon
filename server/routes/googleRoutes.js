import express from 'express';

const router = express.Router();

import { Hospital } from '../models/Healthcare.js';

// Fetch nearby hospitals by city/state query using OpenStreetMap Nominatim
router.get('/hospitals', async (req, res) => {
  try {
    const city = req.query.city || "Udaipur";
    const state = req.query.state || "Rajasthan";
    const query = encodeURIComponent(`hospitals in ${city} ${state}`);
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5`;

    const response = await fetch(osmUrl, {
      headers: { "User-Agent": "GlobeTrotterApp/1.0 (contact@globetrotter.app)" }
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const formatted = data.map(h => ({
          name: h.display_name.split(',')[0],
          formatted_address: h.display_name,
          geometry: { location: { lat: parseFloat(h.lat), lng: parseFloat(h.lon) } }
        }));
        return res.json(formatted);
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
