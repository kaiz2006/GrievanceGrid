/**
 * Haversine formula to calculate the distance between two coordinates in meters.
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
};

/**
 * Validates if the user is within the required radius (e.g., 50m).
 */
export const isWithinRadius = (
  pos1: { lat: number; lng: number },
  pos2: { lat: number; lng: number },
  radiusMeters: number = 50
): boolean => {
  const distance = calculateDistance(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
  return distance <= radiusMeters;
};
