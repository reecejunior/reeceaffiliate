export type NearbyPlace = {
  id: string;
  name: string;
  category: string;
  rating: number;
  latitude: number;
  longitude: number;
};

export type PlaceDetails = NearbyPlace & {
  address?: string;
  phone?: string;
  website?: string;
  hours?: string;
  images?: string[];
  safetyScore?: number; // 0-100
};

export type IncidentType = 'accidents' | 'crime' | 'robbery' | 'theft' | 'assault';
export type TimeRange = '24h' | '7d' | '30d';

export type SafetyTile = {
  id: string;
  center: { latitude: number; longitude: number };
  safetyScore: number; // 0-100
  topIncidents: { type: IncidentType; count: number }[];
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchNearbyPlaces(params: { latitude: number; longitude: number }): Promise<NearbyPlace[]> {
  await delay(300);
  const { latitude, longitude } = params;
  return [
    { id: '1', name: 'Central Park', category: 'Park', rating: 4.7, latitude: latitude + 0.002, longitude: longitude + 0.001 },
    { id: '2', name: 'City Museum', category: 'Museum', rating: 4.5, latitude: latitude - 0.0015, longitude: longitude + 0.0022 },
    { id: '3', name: 'Art Gallery', category: 'Gallery', rating: 4.3, latitude: latitude + 0.0025, longitude: longitude - 0.001 },
    { id: '4', name: "Traveler's Cafe", category: 'Cafe', rating: 4.6, latitude: latitude - 0.002, longitude: longitude - 0.0015 },
  ];
}

export async function fetchPlaceDetails(id: string): Promise<PlaceDetails> {
  await delay(250);
  const base: Record<string, PlaceDetails> = {
    '1': {
      id: '1',
      name: 'Central Park',
      category: 'Park',
      rating: 4.7,
      latitude: 0,
      longitude: 0,
      address: '123 Park Ave',
      phone: '+1 555-0101',
      website: 'https://centralpark.example.com',
      hours: '8:00 AM - 9:00 PM',
      images: [],
      safetyScore: 86,
    },
    '2': {
      id: '2',
      name: 'City Museum',
      category: 'Museum',
      rating: 4.5,
      latitude: 0,
      longitude: 0,
      address: '456 Museum Rd',
      phone: '+1 555-0202',
      website: 'https://museum.example.com',
      hours: '10:00 AM - 6:00 PM',
      images: [],
      safetyScore: 72,
    },
    '3': {
      id: '3',
      name: 'Art Gallery',
      category: 'Gallery',
      rating: 4.3,
      latitude: 0,
      longitude: 0,
      address: '789 Gallery St',
      phone: '+1 555-0303',
      website: 'https://gallery.example.com',
      hours: '11:00 AM - 7:00 PM',
      images: [],
      safetyScore: 65,
    },
    '4': {
      id: '4',
      name: "Traveler's Cafe",
      category: 'Cafe',
      rating: 4.6,
      latitude: 0,
      longitude: 0,
      address: '17 Coffee Ln',
      phone: '+1 555-0404',
      website: 'https://cafe.example.com',
      hours: '7:00 AM - 8:00 PM',
      images: [],
      safetyScore: 78,
    },
  };
  return base[id] ?? {
    id,
    name: 'Unknown place',
    category: 'Unknown',
    rating: 0,
    latitude: 0,
    longitude: 0,
    safetyScore: 50,
  };
}

export async function fetchSafetyTiles(params: {
  city: string;
  center: { latitude: number; longitude: number };
  incidentTypes?: IncidentType[];
  timeRange?: TimeRange;
}): Promise<SafetyTile[]> {
  await delay(350);
  const { center } = params;
  // Create a few hex-like tiles around the center with varying scores
  const offsets = [
    [0, 0],
    [0.003, 0],
    [-0.003, 0],
    [0, 0.003],
    [0, -0.003],
    [0.002, 0.002],
    [-0.002, -0.002],
  ];
  const scores = [85, 60, 45, 72, 30, 90, 55];
  const tiles: SafetyTile[] = offsets.map(([dx, dy], idx) => ({
    id: `tile-${idx + 1}`,
    center: { latitude: center.latitude + dx, longitude: center.longitude + dy },
    safetyScore: scores[idx % scores.length],
    topIncidents: [
      { type: 'crime', count: Math.floor(Math.random() * 5) },
      { type: 'robbery', count: Math.floor(Math.random() * 3) },
      { type: 'accidents', count: Math.floor(Math.random() * 2) },
    ],
  }));
  return tiles;
}

// --- OCR, Language, Translation (Mocked) ---
export async function ocrImage(base64: string): Promise<{ text: string }>{
  await delay(200);
  return { text: 'Bienvenidos a la ciudad. Horario: 9:00 - 18:00.' };
}

export async function detectLanguage(text: string): Promise<string> {
  await delay(80);
  const lower = text.toLowerCase();
  if (/[áéíóúñ¿¡]/.test(lower) || lower.includes('bienvenidos')) return 'es';
  if (/[àâçéèêëîïôùûüÿœ]/.test(lower) || lower.includes('bonjour')) return 'fr';
  return 'en';
}

export async function translateText(text: string, to: string): Promise<string> {
  await delay(150);
  return `(${to}) ${text}`;
}

// --- Culture ---
export type CultureData = {
  cityId: string;
  greetings: string[];
  tipping: string[];
  etiquette: string[];
  taboos: string[];
  emergencyContacts: { label: string; value: string }[];
  quickTips: string[];
};

export async function fetchCulture(cityId: string): Promise<CultureData> {
  await delay(220);
  return {
    cityId,
    greetings: ['Handshake, eye contact', 'Use formal titles initially'],
    tipping: ['Restaurants: 10-15%', 'Taxis: round up', 'Hotels: small tips appreciated'],
    etiquette: ['Be punctual', 'Dress modestly in religious areas'],
    taboos: ['Avoid loud conversations on public transport'],
    emergencyContacts: [
      { label: 'Emergency', value: '112' },
      { label: 'Police', value: '110' },
      { label: 'Ambulance', value: '118' },
    ],
    quickTips: ['Carry small change', 'Learn basic phrases', 'Keep copies of documents'],
  };
}

// --- Rentals ---
export type RentalOption = {
  id: string;
  provider: string;
  type: 'car' | 'scooter' | 'bike';
  price: number;
  unit: 'day' | 'hour';
  latitude: number;
  longitude: number;
  bookingUrl: string;
};

export async function fetchRentalsNearby(params: { latitude: number; longitude: number }): Promise<RentalOption[]> {
  await delay(250);
  const { latitude, longitude } = params;
  return [
    { id: 'r1', provider: 'CityCar', type: 'car', price: 49, unit: 'day', latitude: latitude + 0.002, longitude: longitude + 0.001, bookingUrl: 'https://booking.example.com/citycar' },
    { id: 'r2', provider: 'ZipScoot', type: 'scooter', price: 8, unit: 'hour', latitude: latitude - 0.0015, longitude: longitude + 0.0022, bookingUrl: 'https://booking.example.com/zipscoot' },
    { id: 'r3', provider: 'BikeNow', type: 'bike', price: 5, unit: 'hour', latitude: latitude + 0.0025, longitude: longitude - 0.001, bookingUrl: 'https://booking.example.com/bikenow' },
  ];
}

// --- Speech/Transcription (Mock) ---
export async function transcribeAudio(uri: string): Promise<{ text: string; language: string }>{
  await delay(300);
  return { text: '¿Dónde está la estación?', language: 'es' };
}

