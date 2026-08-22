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
      const timeoutId = setTimeout(() => controller.abort(), 2500);

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

// Attempt to repair truncated JSON by closing any open structures
const repairJSON = (str) => {
  // Remove trailing incomplete key-value pairs and whitespace
  let s = str.trimEnd();
  // Close open strings
  const quoteCount = (s.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) s += '"';
  // Count open brackets/braces and close them
  let openBraces = 0, openBrackets = 0;
  let inString = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === '"' && (i === 0 || s[i - 1] !== '\\')) inString = !inString;
    if (!inString) {
      if (ch === '{') openBraces++;
      else if (ch === '}') openBraces--;
      else if (ch === '[') openBrackets++;
      else if (ch === ']') openBrackets--;
    }
  }
  // Remove trailing comma before closing
  s = s.replace(/,\s*$/, '');
  while (openBrackets > 0) { s += ']'; openBrackets--; }
  while (openBraces > 0) { s += '}'; openBraces--; }
  return s;
};

export const generateItinerary = async (tripData) => {
  try {
    const prompt = `Generate a detailed travel itinerary for India.
Parameters:
- Destination: ${tripData.location}
- Duration: ${tripData.duration} days
- Budget/Stay: ${tripData.stay}
- Transport: ${tripData.transport}
- Dietary: ${tripData.dietary}
- Interests: ${tripData.interests.join(", ")}
- Vibe: ${tripData.vibe}

Rules:
1. 3 to 4 activities per day (keep descriptions to 1-2 sentences).
2. Include food suggestions and safety notes per day.
3. Include estimated cost breakdown in INR.

Return ONLY a valid, complete JSON object. No markdown. No extra text. No trailing commas.
JSON structure:
{
  "tripTitle": "string",
  "overview": "string",
  "safetyMetrics": { "guardiansCount": 24, "hospitalDistanceKm": 1.4, "safetyScore": 89 },
  "dailyItinerary": [
    {
      "day": 1,
      "theme": "string",
      "activities": [
        { "time": "09:00 AM", "activity": "string", "description": "string", "location": "Specific place name" }
      ],
      "foodSuggestions": ["Restaurant (Dish)"],
      "safetyNotes": "string"
    }
  ],
  "estimatedCosts": {
    "total": "string",
    "breakdown": { "accommodation": "string", "food": "string", "transport": "string", "activities": "string" }
  },
  "essentialPacking": ["Item 1", "Item 2", "Item 3"]
}`;

    let text = null;

    // 1. PRIMARY: GOOGLE GEMINI API
    // Try secondary key first since primary is reported as leaked
    const apiKeys = [
      process.env.GEMINI_API_KEY_SECONDARY,
      process.env.GEMINI_API_KEY
    ].filter((key, idx, self) => key && self.indexOf(key) === idx);

    const modelsToTry = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-2.5-pro"];

    keyLoop:
    for (const apiKey of apiKeys) {
      for (const model of modelsToTry) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
                maxOutputTokens: 4096
              }
            })
          });

          if (res.ok) {
            const result = await res.json();
            if (result.candidates && result.candidates.length > 0) {
              text = result.candidates[0].content.parts[0].text;
              console.log(`[GEMINI-AI] Rich itinerary generated via Gemini model (${model}) successfully!`);
              break keyLoop;
            }
          } else {
            const errData = await res.json();
            console.warn(`Gemini key ${apiKey.slice(0, 10)}... model ${model} failed:`, errData.error?.message);
          }
        } catch (err) {
          console.warn(`Gemini model ${model} fetch exception:`, err.message);
        }
      }
    }

    // 2. FALLBACK TO GROQ IF GEMINI IS UNAVAILABLE
    if (!text) {
      console.log("[LLM FALLBACK] Gemini unavailable, falling back to Groq...");
      const groqKey = process.env.GROQ_API_KEY;
      if (groqKey) {
        const groqModels = ["llama-3.3-70b-versatile", "llama3-70b-8192", "mixtral-8x7b-32768"];
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
                response_format: { type: "json_object" },
                max_tokens: 4096
              })
            });

            if (gRes.ok) {
              const gData = await gRes.json();
              if (gData.choices && gData.choices.length > 0) {
                text = gData.choices[0].message.content;
                console.log(`[GROQ-FALLBACK] Generated via Groq model (${gModel}) successfully!`);
                break;
              }
            } else {
              const gErrData = await gRes.json();
              console.warn(`Groq model ${gModel} failed:`, gErrData.error?.message);
            }
          } catch (gErr) {
            console.warn(`Groq model ${gModel} fetch exception:`, gErr.message);
          }
        }
      }
    }

    if (!text) {
      throw new Error("AI request failed across Gemini and Groq candidate keys/models.");
    }

    // Sanitize control characters and extract JSON payload
    const sanitizedText = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, " ");
    const jsonMatch = sanitizedText.match(/\{[\s\S]*/);
    if (!jsonMatch) {
      throw new Error("Could not extract valid JSON from AI output.");
    }

    let parsedItinerary;
    try {
      parsedItinerary = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.warn("[JSON-REPAIR] Initial parse failed, attempting repair...", parseErr.message);
      try {
        const repaired = repairJSON(jsonMatch[0]);
        parsedItinerary = JSON.parse(repaired);
        console.log("[JSON-REPAIR] Successfully repaired truncated JSON response.");
      } catch (repairErr) {
        console.error("[JSON-REPAIR] Repair also failed:", repairErr.message);
        throw new Error("Could not parse AI response JSON even after repair.");
      }
    }

    // Thorough Place Grounding with 4.5s max timeout cap to fetch full photo URLs & coordinates
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

    // Allow thorough place grounding up to 4.5s for complete place info & photos
    await Promise.race([
      Promise.all(placePromises),
      new Promise(resolve => setTimeout(resolve, 4500))
    ]);

    return parsedItinerary;
  } catch (error) {
    console.error("Itinerary Generation Error:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
};
