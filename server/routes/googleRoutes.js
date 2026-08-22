import express from 'express';

const router = express.Router();

// Fetch nearby hospitals by city/state query
router.get('/hospitals', async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "GOOGLE_MAPS_API_KEY is not configured" });
    }

    const city = req.query.city || "Udaipur";
    const state = req.query.state || "Rajasthan";
    const query = encodeURIComponent(`hospitals in ${city} ${state}`);
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) {
        return res.status(500).json({ message: "Failed to fetch from Google", error: data });
    }
    res.json(data.results.slice(0, 5));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
