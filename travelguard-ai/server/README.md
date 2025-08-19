Setup

1. Create .env from .env.example and set DATABASE_URL
2. Install deps: npm install
3. Generate client: npm run prisma:generate
4. Run migrations: npm run prisma:migrate
5. Start dev: npm run dev

Endpoints
- GET /health
- GET /places/nearby?lat&lon&types
- GET /places/:id
- GET /safety/tiles?bbox&types&since
- GET /incidents/nearby?lat&lon&radius_km&types
- GET /culture?city_id
- GET /rentals/nearby?lat&lon&type
- GET /downloads/city_packs

