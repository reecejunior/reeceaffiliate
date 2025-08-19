import Constants from 'expo-constants';
const apiBaseFromConstants = (Constants?.expoConfig as any)?.extra?.apiBase;
export const API_BASE = apiBaseFromConstants || process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:3000';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export type BackendPlace = {
  id: string;
  name: string;
  category: string;
  rating?: number;
  lat: number;
  lon: number;
};

export type BackendTile = {
  id: string;
  h3: string;
  score: number;
  scoreFloat: number;
  counts: any;
};

export type BackendRental = {
  id: string;
  provider: string;
  type: string;
  price: number;
  unit: string;
  lat: number;
  lon: number;
  url: string;
};

export async function apiNearbyPlaces(lat: number, lon: number, types?: string) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  if (types) params.set('types', types);
  return get<BackendPlace[]>(`/places/nearby?${params.toString()}`);
}

export async function apiPlace(id: string) {
  return get<BackendPlace>(`/places/${id}`);
}

export async function apiSafetyTiles(args: { bbox?: string; types?: string; since?: string }) {
  const params = new URLSearchParams();
  if (args.bbox) params.set('bbox', args.bbox);
  if (args.types) params.set('types', args.types);
  if (args.since) params.set('since', args.since);
  return get<BackendTile[]>(`/safety/tiles?${params.toString()}`);
}

export async function apiCulture(cityId: string) {
  const params = new URLSearchParams({ city_id: cityId });
  return get(`/culture?${params.toString()}`);
}

export async function apiRentals(lat: number, lon: number, type?: string) {
  const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
  if (type) params.set('type', type);
  return get<BackendRental[]>(`/rentals/nearby?${params.toString()}`);
}

