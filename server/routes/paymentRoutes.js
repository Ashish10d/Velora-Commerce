import express from 'express';
import Stripe from 'stripe';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout-session', protect, async (req, res, next) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return res.status(503).json({ message: 'Payments are not configured yet. Add STRIPE_SECRET_KEY to server/.env.' });
    const { items } = req.body;
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Your cart is empty.' });
    const productIds = items.map(item => item._id);
    const products = await Product.find({ _id: { $in: productIds } });
    const byId = new Map(products.map(product => [String(product._id), product]));
    const lineItems = items.map(item => {
      const product = byId.get(String(item._id));
      if (!product || item.qty < 1 || item.qty > product.countInStock) throw new Error(`Invalid quantity for ${item.name || 'product'}`);
      return { price_data: { currency: 'usd', product_data: { name: product.name, images: product.image ? [product.image] : [] }, unit_amount: Math.round(product.price * 100) }, quantity: item.qty };
    });
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = process.env.CLIENT_URL || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items: lineItems, customer_email: req.user.email, success_url: `${origin}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/checkout?cancelled=true`, metadata: { userId: String(req.user._id) } });
    res.json({ url: session.url });
  } catch (error) { next(error); }
});

export default router;
