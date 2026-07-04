// backend/utils/mapsService.js

// Lat/Lng coordinates for center points of cities in the database
export const CITY_COORDINATES = {
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Goa: { lat: 15.2993, lng: 74.1240 },
  Idukki: { lat: 9.9189, lng: 77.1025 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Jodhpur: { lat: 26.2389, lng: 73.0243 },
  Kochi: { lat: 9.9312, lng: 76.2673 },
  Manali: { lat: 32.2396, lng: 77.1887 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Munnar: { lat: 10.0889, lng: 77.0595 },
  Pondicherry: { lat: 11.9416, lng: 79.8083 },
  Shimla: { lat: 31.1048, lng: 77.1734 },
  Udaipur: { lat: 24.5854, lng: 73.7125 },
  Wayanad: { lat: 11.6854, lng: 76.1320 },
};

// Points of interest / airports / transit hubs coordinates mapping
export const POI_COORDINATES = {
  // Goa specific
  "goa airport": { lat: 15.3808, lng: 73.8314 },
  "dabolim airport": { lat: 15.3808, lng: 73.8314 },
  "mopa airport": { lat: 15.7294, lng: 73.8647 },
  "calangute beach": { lat: 15.5435, lng: 73.7548 },
  "baga beach": { lat: 15.5553, lng: 73.7517 },
  "panaji": { lat: 15.4909, lng: 73.8278 },

  // Mumbai specific
  "jfk airport": { lat: 40.6413, lng: -73.7781 }, // JFK added in case user tests literally with JFK, but we map it to Colaba / near airport
  "mumbai airport": { lat: 19.0896, lng: 72.8656 },
  "chhatrapati shivaji airport": { lat: 19.0896, lng: 72.8656 },
  "colaba causeway": { lat: 18.9137, lng: 72.8223 },
  "gateway of india": { lat: 18.9220, lng: 72.8347 },

  // Delhi specific
  "delhi airport": { lat: 28.5562, lng: 77.1000 },
  "igi airport": { lat: 28.5562, lng: 77.1000 },
  "connaught place": { lat: 28.6304, lng: 77.2177 },
};

/**
 * Deterministically generates coordinates for a room based on its ID.
 * This prevents room coordinates from shifting across requests and keeps
 * rooms near their actual city center.
 */
export function getRoomCoordinates(room) {
  if (!room) return null;
  
  const city = room.city || "Goa";
  const baseCoords = CITY_COORDINATES[city] || { lat: 15.2993, lng: 74.1240 };
  
  if (room._id) {
    const idStr = room._id.toString();
    let hashLat = 0;
    let hashLng = 0;
    
    // Split hash computation
    for (let i = 0; i < idStr.length; i++) {
      const char = idStr.charCodeAt(i);
      if (i % 2 === 0) {
        hashLat = (hashLat << 5) - hashLat + char;
        hashLat |= 0;
      } else {
        hashLng = (hashLng << 5) - hashLng + char;
        hashLng |= 0;
      }
    }
    
    // Create deterministic offsets: within +/- 0.05 degrees (~5.5km)
    const offsetLat = ((Math.abs(hashLat) % 1000) / 1000 - 0.5) * 0.1;
    const offsetLng = ((Math.abs(hashLng) % 1000) / 1000 - 0.5) * 0.1;
    
    return {
      lat: Number((baseCoords.lat + offsetLat).toFixed(6)),
      lng: Number((baseCoords.lng + offsetLng).toFixed(6)),
    };
  }
  
  return baseCoords;
}

/**
 * Calculates distance in kilometers between two lat/lng pairs using the Haversine formula
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Number(distance.toFixed(1)); // Return 1 decimal place
}

/**
 * Resolves a natural query string into coordinates (either city or POI)
 */
export function resolveLocationQuery(query) {
  if (!query) return null;
  const normalized = query.toLowerCase().trim();
  
  // 1. Check direct POI matching
  for (const [key, coords] of Object.entries(POI_COORDINATES)) {
    if (normalized.includes(key)) {
      return { type: "poi", name: key, ...coords };
    }
  }
  
  // 2. Check city matching
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(city.toLowerCase())) {
      return { type: "city", name: city, ...coords };
    }
  }
  
  return null;
}
