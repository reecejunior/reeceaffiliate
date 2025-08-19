export function haversineDistanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const R = 6371; // km
  const dLat = deg2rad(b.latitude - a.latitude);
  const dLon = deg2rad(b.longitude - a.longitude);
  const la1 = deg2rad(a.latitude);
  const la2 = deg2rad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

// Approximate hexagon vertices around a center point. Size in km
export function hexagonForCenter(center: { latitude: number; longitude: number }, sizeKm: number) {
  const lat = center.latitude;
  const lng = center.longitude;
  const dLat = (sizeKm / 111);
  const dLng = (sizeKm / (111 * Math.cos(lat * Math.PI / 180)));
  const points = [] as { latitude: number; longitude: number }[];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    points.push({
      latitude: lat + dLat * Math.sin(angle),
      longitude: lng + dLng * Math.cos(angle),
    });
  }
  return points;
}

