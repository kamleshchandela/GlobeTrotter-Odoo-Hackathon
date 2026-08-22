import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  tripTitle: String,
  overview: String,
  startDate: Date,
  endDate: Date,
  duration: Number,
  budget: String,
  transport: String,
  dietary: String,
  interests: [String],
  vibe: String,
  status: {
    type: String,
    enum: ['active', 'upcoming', 'past'],
    default: 'upcoming'
  },
  dailyItinerary: [{
    day: Number,
    theme: String,
    activities: [{
      time: String,
      activity: String,
      description: String,
      location: String,
      placeId: String,
      lat: Number,
      lng: Number,
      photoUrl: String,
      nextActivityRoute: {
        duration: String,
        distance: Number,
        polyline: String
      }
    }],
    foodSuggestions: [String],
    safetyNotes: String
  }],
  estimatedCosts: {
    total: String,
    breakdown: {
      accommodation: String,
      food: String,
      transport: String,
      activities: String
    }
  },
  essentialPacking: [String]
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
