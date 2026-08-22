import express from 'express';
import { generateItinerary } from '../services/gemini.service.js';
import { protect } from '../middleware/authMiddleware.js';
import Trip from '../models/Trip.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const tripData = req.body;
    
    if (!tripData.location || !tripData.duration) {
      return res.status(400).json({ message: "Location and duration are required." });
    }

    const itinerary = await generateItinerary(tripData);
    // Include the original inputs in the response so frontend can save them
    res.json({
      ...itinerary,
      location: tripData.location,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      duration: tripData.duration,
      budget: tripData.budget,
      transport: tripData.transport,
      dietary: tripData.dietary,
      interests: tripData.interests,
      vibe: tripData.vibe
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/save', protect, async (req, res) => {
  try {
    const tripData = req.body;
    tripData.user = req.user._id;
    if (tripData.startDate === "") delete tripData.startDate;
    if (tripData.endDate === "") delete tripData.endDate;
    const trip = await Trip.create(tripData);
    res.status(201).json(trip);
  } catch (error) {
    console.error("Save trip error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort('-createdAt');
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
