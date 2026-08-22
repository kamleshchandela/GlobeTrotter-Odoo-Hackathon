import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import PlaceCache from "../models/PlaceCache.js";
import RouteCache from "../models/RouteCache.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

import mongoose from "mongoose";

const getOsmPlaceInfo = async (placeName, location) => {
  const query = `${placeName}, ${location}`;
  
  // Check Cache first if database connection is active
  if (mongoose.connection.readyState === 1) {
    try {
      const cached = await PlaceCache.findOne({ query });
      if (cached) return cached;
    } catch (e) {
      console.warn("PlaceCache read error:", e.message);
    }
  }

  const fetchNominatim = async (searchQuery) => {
    const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;
    const response = await fetch(osmUrl, {
      headers: { "User-Agent": "GlobeTrotterApp/1.0 (contact@globetrotter.app)" }
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return data[0];
      }
    }
    return null;
  };

  // OpenStreetMap Nominatim API
  try {
    let place = await fetchNominatim(query);
    
    // Fallback: If exact place not found, just use the location (city) coordinates
    if (!place) {
      console.warn(`Place not found: ${query}. Falling back to location: ${location}`);
      place = await fetchNominatim(location);
    }

    if (place) {
      const result = {
        placeId: `osm-${place.place_id}`,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
        photoUrl: `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80`
      };

      if (mongoose.connection.readyState === 1) {
        PlaceCache.create({ query, ...result }).catch(err => console.error("Place cache save error", err.message));
      }
      return result;
    }
  } catch (osmError) {
    console.error("Nominatim Geocoding Error:", osmError.message);
  }

  return null;
};

const getOsmRouteInfo = async (origin, destination) => {
  // Check Cache first to avoid unnecessary network costs
  if (mongoose.connection.readyState === 1) {
    try {
      const cached = await RouteCache.findOne({
        originLat: origin.lat, originLng: origin.lng,
        destLat: destination.lat, destLng: destination.lng
      });
      if (cached) return cached;
    } catch (e) {
      console.warn("RouteCache read error:", e.message);
    }
  }

  // Free OSRM (Open Source Routing Machine) API
  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=polyline`;
    const response = await fetch(osrmUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const result = {
          duration: `${Math.round(route.duration)}s`,
          distance: Math.round(route.distance),
          polyline: route.geometry
        };

        if (mongoose.connection.readyState === 1) {
          RouteCache.create({
            originLat: origin.lat, originLng: origin.lng,
            destLat: destination.lat, destLng: destination.lng,
            ...result
          }).catch(err => console.error("Route cache save error", err.message));
        }
        return result;
      }
    }
  } catch (osrmError) {
    console.error("OSRM Routing Error:", osrmError.message);
  }

  return null;
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

    const modelsToTry = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-flash-latest"];
    let response = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (res.ok) {
          response = res;
          break;
        } else {
          const errData = await res.json();
          console.warn(`Model ${model} failed:`, errData.error?.message);
          lastError = errData.error?.message;
        }
      } catch (err) {
        console.warn(`Model ${model} fetch exception:`, err.message);
        lastError = err.message;
      }
    }

    if (!response) {
      throw new Error(lastError || "Gemini API request failed across all candidate models.");
    }

    const result = await response.json();
    if (!result.candidates || result.candidates.length === 0) {
      console.error("GEMINI_API_NO_CANDIDATES:", JSON.stringify(result, null, 2));
      throw new Error("Gemini returned no results. Check if your query is safe.");
    }
    const text = result.candidates[0].content.parts[0].text;
    const cleanJson = text.replace(/```json|```/gi, "").trim();
    const parsedItinerary = JSON.parse(cleanJson);
    console.log("GEMINI_GENERATION_SUCCESS: Starting OpenStreetMap grounding...");

    // Grounding Layer 1: Validate locations with OpenStreetMap Nominatim in parallel
    const placePromises = [];
    for (const day of parsedItinerary.dailyItinerary) {
      for (const activity of day.activities) {
        if (activity.location) {
          placePromises.push(
            getOsmPlaceInfo(activity.location, tripData.location).then(groundedData => {
              if (groundedData) {
                activity.placeId = groundedData.placeId;
                activity.lat = groundedData.lat;
                activity.lng = groundedData.lng;
                activity.photoUrl = groundedData.photoUrl;
              }
            })
          );
        }
      }
    }
    await Promise.all(placePromises);

    // Grounding Layer 2: Validate Routes between activities with OSRM in parallel
    const routePromises = [];
    for (const day of parsedItinerary.dailyItinerary) {
      for (let i = 0; i < day.activities.length - 1; i++) {
        const start = day.activities[i];
        const end = day.activities[i+1];
        if (start.lat && end.lat) {
          routePromises.push(
            getOsmRouteInfo(start, end).then(routeData => {
              if (routeData) {
                start.nextActivityRoute = routeData;
              }
            })
          );
        }
      }
    }
    await Promise.all(routePromises);

    return parsedItinerary;
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    throw new Error("Failed to generate and ground itinerary. Please try again.");
  }
};
