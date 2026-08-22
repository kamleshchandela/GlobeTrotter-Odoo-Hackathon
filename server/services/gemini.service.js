import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import PlaceCache from "../models/PlaceCache.js";
import RouteCache from "../models/RouteCache.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGoogleMapsPlaceInfo = async (placeName, location) => {
  try {
    const query = `${placeName} in ${location}`;
    
    // Check Cache first
    const cached = await PlaceCache.findOne({ query });
    if (cached) return cached;

    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.location,places.displayName,places.photos"
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 1
      })
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    
    if (data.places && data.places.length > 0) {
      const place = data.places[0];
      let photoUrl = null;
      if (place.photos && place.photos.length > 0) {
        photoUrl = `https://places.googleapis.com/v1/${place.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&key=${process.env.GOOGLE_MAPS_API_KEY}`;
      }
      
      const result = {
        placeId: place.id,
        lat: place.location.latitude,
        lng: place.location.longitude,
        photoUrl
      };

      // Save to cache
      await PlaceCache.create({ query, ...result });

      return result;
    }
    return null;
  } catch (error) {
    console.error("Maps API Grounding Error:", error);
    return null;
  }
};

const getGoogleMapsRouteInfo = async (origin, destination) => {
  try {
    // Check Cache first to avoid Google Maps API costs
    const cached = await RouteCache.findOne({
      originLat: origin.lat, originLng: origin.lng,
      destLat: destination.lat, destLng: destination.lng
    });
    if (cached) return cached;

    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE"
      })
    });
    
    if (!response.ok) return null;
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const result = {
        duration: route.duration, // e.g. "1200s"
        distance: route.distanceMeters,
        polyline: route.polyline.encodedPolyline
      };
      
      // Save to cache asynchronously
      RouteCache.create({
        originLat: origin.lat, originLng: origin.lng,
        destLat: destination.lat, destLng: destination.lng,
        ...result
      }).catch(err => console.error("Route cache save error", err));

      return result;
    }
    return null;
  } catch (error) {
    console.error("Routes API Grounding Error:", error);
    return null;
  }
};

export const generateItinerary = async (tripData) => {
  try {
    const prompt = `
      Generate a realistic, incredibly detailed travel itinerary for India with the following parameters:
      - Destination: ${tripData.location}
      - Duration: ${tripData.duration} days
      - Budget/Stay Preference: ${tripData.stay}
      - Transport: ${tripData.transport}
      - Dietary Preference: ${tripData.dietary}
      - Interests: ${tripData.interests.join(", ")}
      - Vibe: ${tripData.vibe}

      IMPORTANT: Make the descriptions engaging and highly detailed. 
      - Do NOT just give basic descriptions. For each activity, include what the user will discover, why they must visit, historical or cultural significance, and insider tips.
      - For each day, provide explicit, location-specific "safetyNotes" (e.g. "beware of pickpockets near the temple", "avoid isolated alleys after 9 PM", "only use prepaid taxis").

      Only suggest real, physically existing places. Factor in realistic travel times between activities.

      The response MUST be a valid JSON object with the following structure:
      {
        "tripTitle": "Catchy title",
        "overview": "Detailed summary of the trip, the atmosphere, and what to expect",
        "dailyItinerary": [
          {
            "day": 1,
            "theme": "Day's theme",
            "activities": [
              {
                "time": "Specific Time (e.g. 09:30 AM)",
                "activity": "Activity title",
                "description": "Rich 3-4 sentence description explaining why to visit, what you'll discover, and insider tips.",
                "location": "Specific existing place name (e.g. City Palace, Udaipur)"
              }
            ], // Generate 4 to 6 activities per day. Do not limit to just 3!
            "foodSuggestions": ["Specific Restaurant Name 1 (Known for XYZ)", "Specific Restaurant Name 2"],
            "safetyNotes": "Comprehensive safety guidelines for this specific day's activities and areas."
          }
        ],
        "estimatedCosts": {
          "total": "Range in ₹",
          "breakdown": {
            "accommodation": "Range",
            "food": "Range",
            "transport": "Range",
            "activities": "Range"
          }
        },
        "essentialPacking": ["Item 1", "Item 2"]
      }

      Strictly return ONLY the JSON object. Do not wrap in markdown or backticks.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("GEMINI_API_ERROR_BODY:", JSON.stringify(errData, null, 2));
      throw new Error(errData.error?.message || "Gemini API request failed");
    }

    const result = await response.json();
    if (!result.candidates || result.candidates.length === 0) {
      console.error("GEMINI_API_NO_CANDIDATES:", JSON.stringify(result, null, 2));
      throw new Error("Gemini returned no results. Check if your query is safe.");
    }
    const text = result.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/gi, "").trim();
    const parsedItinerary = JSON.parse(cleanJson);
    console.log("GEMINI_GENERATION_SUCCESS: Starting grounding...");

    // Grounding Layer 1: Validate locations with Google Maps Places
    for (const day of parsedItinerary.dailyItinerary) {
      for (const activity of day.activities) {
        if (activity.location) {
          const groundedData = await getGoogleMapsPlaceInfo(activity.location, tripData.location);
          if (groundedData) {
            activity.placeId = groundedData.placeId;
            activity.lat = groundedData.lat;
            activity.lng = groundedData.lng;
            activity.photoUrl = groundedData.photoUrl;
          }
        }
      }

      // Grounding Layer 2: Validate Routes between activities for each day
      for (let i = 0; i < day.activities.length - 1; i++) {
        const start = day.activities[i];
        const end = day.activities[i+1];
        if (start.lat && end.lat) {
          const routeData = await getGoogleMapsRouteInfo(start, end);
          if (routeData) {
            start.nextActivityRoute = routeData;
          }
        }
      }
    }

    return parsedItinerary;
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    throw new Error("Failed to generate and ground itinerary. Please try again.");
  }
};
