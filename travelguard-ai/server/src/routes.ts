import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

router.get('/places/nearby', async (req: any, res: any) => {
  const schema = z.object({ lat: z.coerce.number(), lon: z.coerce.number(), types: z.string().optional() });
  const { lat, lon, types } = schema.parse(req.query);
  const categories = types?.split(',');
  const places = await prisma.place.findMany({
    where: categories ? { category: { in: categories } } : undefined,
    take: 50,
  });
  res.json(places);
});

router.get('/places/:id', async (req: any, res: any) => {
  const { id } = z.object({ id: z.string() }).parse(req.params);
  const place = await prisma.place.findUnique({ where: { id } });
  if (!place) return res.status(404).json({ error: 'Not found' });
  res.json(place);
});

router.get('/safety/tiles', async (req: any, res: any) => {
  const schema = z.object({ bbox: z.string().optional(), types: z.string().optional(), since: z.string().optional() });
  const _params = schema.parse(req.query);
  const tiles = await prisma.tileH3.findMany({ take: 500 });
  res.json(tiles);
});

router.get('/incidents/nearby', async (req: any, res: any) => {
  const schema = z.object({ lat: z.coerce.number(), lon: z.coerce.number(), radius_km: z.coerce.number().default(5), types: z.string().optional() });
  const { types } = schema.parse(req.query);
  const filter = types?.split(',');
  const incidents = await prisma.incident.findMany({ where: filter ? { type: { in: filter } } : undefined, take: 200 });
  res.json(incidents);
});

router.get('/culture', async (req: any, res: any) => {
  const { city_id } = z.object({ city_id: z.string() }).parse(req.query);
  const culture = await prisma.culture.findUnique({ where: { cityId: city_id } });
  if (!culture) return res.status(404).json({ error: 'Not found' });
  res.json(culture);
});

router.get('/rentals/nearby', async (req: any, res: any) => {
  const schema = z.object({ lat: z.coerce.number(), lon: z.coerce.number(), type: z.string().optional() });
  const { type } = schema.parse(req.query);
  const rentals = await prisma.rental.findMany({ where: type ? { type } : undefined, take: 100 });
  res.json(rentals);
});

router.get('/downloads/city_packs', async (_req: any, res: any) => {
  const cities = await prisma.city.findMany({ take: 20 });
  const packs = cities.map((c) => ({ id: c.id, name: `${c.name}, ${c.country}`, size_mb: 120 }));
  res.json(packs);
});

export default router;

