import Stripe from 'stripe';
import { Router } from 'express';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-07-30.basil' });
const router = Router();

router.post('/create-payment-intent', async (req: any, res: any) => {
  const { amount, currency } = z.object({ amount: z.number().int().positive(), currency: z.string().default('usd') }).parse(req.body);
  try {
    const pi = await stripe.paymentIntents.create({ amount, currency });
    res.json({ clientSecret: pi.client_secret });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;

