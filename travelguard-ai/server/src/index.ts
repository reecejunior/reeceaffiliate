import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import routes from './routes';
import stripeRoutes from './payments/stripe';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/health', async (_req: express.Request, res: express.Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.use(routes);
app.use('/payments', stripeRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API listening on :${port}`);
});

