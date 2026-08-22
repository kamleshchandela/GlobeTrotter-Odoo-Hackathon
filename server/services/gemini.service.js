import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import PlaceCache from "../models/PlaceCache.js";
import RouteCache from "../models/RouteCache.js";
import mongoose from "mongoose";

dotenv.config();

const getGoogleMapsPlaceInfo = async (placeName, location) => {
  const query = `${placeName} in ${location}`;

  // Check Cache first if database connection is active
  if (mongoose.connection.readyState === 1) {
    try {
      const cached = await PlaceCache.findOne({ query }).lean();
      if (cached) return cached;
    } catch (e) {
      console.warn("PlaceCache read error:", e.message);
    }
  }

  // Attempt 1: Google Places API
  if (process.env.GOOGLE_MAPS_API_KEY) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

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
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.ok) {
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
          if (mongoose.connection.readyState === 1) {
            PlaceCache.create({ query, ...result }).catch(() => {});
          }
          return result;
        }
      }
    } catch (err) {
      console.warn("Google Places API failed, trying Nominatim fallback:", err.message);
    }
  }

  // Helper: OpenStreetMap Nominatim Fetcher
  const fetchNominatim = async (searchQuery) => {
    try {
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
    } catch (err) {
      console.warn("Nominatim fetch error:", err.message);
    }
    return null;
  };

  // Attempt 2: OpenStreetMap Nominatim API Fallback
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

      // Save to cache asynchronously if connected
      if (mongoose.connection.readyState === 1) {
        PlaceCache.create({ query, ...result }).catch(() => {});
      }
      return result;
    }
  } catch (error) {
    console.error("Nominatim geocoding error:", error.message);
  }

  return null;
};

export const generateItinerary = async (tripData) => {
  try {
    const prompt = `
      Generate a realistic travel itinerary for India with parameters:
      - Destination: ${tripData.location}
      - Duration: ${tripData.duration} days
      - Budget/Stay: ${tripData.stay}
      - Transport: ${tripData.transport}
      - Dietary: ${tripData.dietary}
      - Interests: ${tripData.interests.join(", ")}
      - Vibe: ${tripData.vibe}

      Limit to 3 activities per day with crisp descriptions.
      Return ONLY a raw JSON object with key "tripTitle", "overview", "dailyItinerary", "estimatedCosts", "essentialPacking". No markdown, no prose.
      JSON structure:
      {
        "tripTitle": "Catchy title",
        "overview": "Short summary",
        "dailyItinerary": [
          {
            "day": 1,
            "theme": "Day theme",
            "activities": [
              {
                "time": "09:30 AM",
                "activity": "Activity title",
                "description": "Short highlight.",
                "location": "Specific existing place name (e.g. City Palace, Udaipur)"
              }
            ],
            "foodSuggestions": ["Restaurant 1", "Restaurant 2"],
            "safetyNotes": "Location safety tip."
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
    `;

    const apiKeys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_SECONDARY,
      "AIzaSyB74Hnt8oTLeZ_lPlpoa7MIMpNMovcyhfY"
    ].filter((key, idx, self) => key && self.indexOf(key) === idx);

    const modelsToTry = ["gemini-3.6-flash", "gemini-flash-latest"];
    let response = null;
    let lastError = null;

    keyLoop:
    for (const apiKey of apiKeys) {
      for (const model of modelsToTry) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          });

          if (res.ok) {
            response = res;
            break keyLoop;
          } else {
            const errData = await res.json();
            console.warn(`Gemini key ${apiKey.slice(0, 10)}... model ${model} failed:`, errData.error?.message);
            lastError = errData.error?.message;
          }
        } catch (err) {
          console.warn(`Model ${model} fetch exception:`, err.message);
          lastError = err.message;
        }
      }
    }

    if (!response) {
      throw new Error(lastError || "Gemini API request failed across all candidate keys and models.");
    }

    const result = await response.json();
    if (!result.candidates || result.candidates.length === 0) {
      throw new Error("Gemini returned no results. Please try again.");
    }

    const text = result.candidates[0].content.parts[0].text;
    
    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract valid JSON from Gemini output.");
    }

    const parsedItinerary = JSON.parse(jsonMatch[0]);

    // Fast Non-Blocking Place Grounding with 1.0s max timeout cap
    const placePromises = [];
    if (parsedItinerary.dailyItinerary && Array.isArray(parsedItinerary.dailyItinerary)) {
      for (const day of parsedItinerary.dailyItinerary) {
        if (day.activities && Array.isArray(day.activities)) {
          for (const activity of day.activities) {
            if (activity.location) {
              placePromises.push(
                getGoogleMapsPlaceInfo(activity.location, tripData.location).then(groundedData => {
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
      }
    }

    // Cap grounding wait time to 1.0s max so response returns almost instantly
    await Promise.race([
      Promise.all(placePromises),
      new Promise(resolve => setTimeout(resolve, 1000))
    ]);

    return parsedItinerary;
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
};
