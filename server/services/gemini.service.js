import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import PlaceCache from "../models/PlaceCache.js";
import RouteCache from "../models/RouteCache.js";
import mongoose from "mongoose";

dotenv.config();

const fetchNominatim = async (queryStr) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}`, {
      headers: { "User-Agent": "MyItineraryApp/1.0" }
    });
    if (res.ok) {
      const data = await res.json();
      return data && data.length > 0 ? data[0] : null;
    }
    return null;
  } catch (e) {
    return null;
  }
};

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

  // Attempt 2: OpenStreetMap Nominatim API Fallback
  try {
    let place = await fetchNominatim(query);
    if (!place) {
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
        "overview": "Summary of the trip atmosphere and expectations",
        "safetyMetrics": {
          "guardiansCount": 24, // realistic estimated count of active safety guardians in this destination area
          "hospitalDistanceKm": 1.4, // realistic distance in km to the nearest major hospital
          "safetyScore": 89 // safety rating index from 1-100 based on area crime indexes and infrastructure
        },
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

    let text = null;

    // 1. TRY GROQ HARDWARE ACCELERATED LLM FIRST (Sub-2-Second Speed!)
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      const groqModels = ["openai/gpt-oss-120b", "groq/compound", "qwen/qwen3.6-27b"];

      for (const gModel of groqModels) {
        try {
          const gRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: gModel,
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" }
            })
          });

          if (gRes.ok) {
            const gData = await gRes.json();
            if (gData.choices && gData.choices.length > 0) {
              text = gData.choices[0].message.content;
              console.log(`[FAST-LLM] Generated via Groq model (${gModel}) successfully!`);
              break;
            }
          }
        } catch (gErr) {
          console.warn(`Groq model ${gModel} failed, trying next...`, gErr.message);
        }
      }
    }

    // 2. FALLBACK TO GEMINI IF GROQ IS UNAVAILABLE
    if (!text) {
      console.log("[LLM FALLBACK] Groq unavailable, falling back to Gemini...");
      const apiKeys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_SECONDARY
      ].filter((key, idx, self) => key && self.indexOf(key) === idx);

      const modelsToTry = ["gemini-3.6-flash", "gemini-flash-latest"];

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
              const result = await res.json();
              if (result.candidates && result.candidates.length > 0) {
                text = result.candidates[0].content.parts[0].text;
                break keyLoop;
              }
            }
          } catch (err) {
            console.warn(`Gemini model ${model} fetch exception:`, err.message);
          }
        }
      }
    }

    if (!text) {
      throw new Error("AI request failed across Groq and Gemini candidate keys/models.");
    }

    // Extract JSON payload
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract valid JSON from AI output.");
    }

    const parsedItinerary = JSON.parse(jsonMatch[0]);

    // Fast Non-Blocking Place Grounding with 1.0s max timeout cap
    const placePromises = [];
    for (const day of parsedItinerary.dailyItinerary) {
      for (const activity of day.activities) {
        if (activity.location) {
          placePromises.push(
            getGoogleMapsPlaceInfo(activity.location, tripData.location).then(async (groundedData) => {
              if (groundedData) {
                activity.placeId = groundedData.placeId;
                activity.lat = groundedData.lat;
                activity.lng = groundedData.lng;
                activity.photoUrl = groundedData.photoUrl;
              }
              
              // Fallback to Unsplash Source if photoUrl is empty or fails
              if (!activity.photoUrl) {
                const searchKeyword = encodeURIComponent(`${activity.location} ${tripData.location}`);
                activity.photoUrl = `https://images.unsplash.com/photo-1506461883276-594a12b11cc3?auto=format&fit=crop&w=600&q=80`; // Safe architectural default
                try {
                  const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${searchKeyword}&per_page=1&client_id=eM58fP_gT7XqZ3iN5fP1N-Z-rB9B9z0n1O1w4s4n1eI`);
                  if (unsplashRes.ok) {
                    const unsplashData = await unsplashRes.json();
                    if (unsplashData.results && unsplashData.results.length > 0) {
                      activity.photoUrl = unsplashData.results[0].urls.small;
                    }
                  }
                } catch (e) {
                  // Keep safe default architectural image if search fails
                }
              }
            })
          );
        }
      }
    }

    // Wait max 4 seconds for place grounding and Unsplash fallback, or proceed immediately
    await Promise.race([
      Promise.all(placePromises),
      new Promise(resolve => setTimeout(resolve, 4000))
    ]);

    return parsedItinerary;
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
};
