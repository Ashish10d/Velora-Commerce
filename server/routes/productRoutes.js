import express from 'express'; import mongoose from 'mongoose'; import Product from '../models/Product.js'; import { protect, admin } from '../middleware/auth.js';
const router = express.Router();
router.get('/', async (req, res, next) => {
  try {
    const { search = '', category, sort = 'featured', page = 1, limit = 12 } = req.query;
    const query = {};
    const aliases = {
      shoe: ['shoe', 'sneaker', 'runner', 'footwear'], shoes: ['shoe', 'sneaker', 'runner', 'footwear'],
      sneaker: ['shoe', 'sneaker', 'runner', 'footwear'], sneakers: ['shoe', 'sneaker', 'runner', 'footwear'],
      headphone: ['headphone', 'earphone', 'audio', 'sound'], headphones: ['headphone', 'earphone', 'audio', 'sound'],
      earphone: ['headphone', 'earphone', 'audio', 'sound'], earphones: ['headphone', 'earphone', 'audio', 'sound']
    };
    const words = String(search).toLowerCase().trim().split(/\s+/).filter(Boolean);
    const terms = [...new Set(words.flatMap(word => aliases[word] || [word]))];
    if (terms.length) {
      query.$or = terms.flatMap(value => {
        const safeValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return ['name', 'brand', 'category', 'description'].map(field => ({ [field]: { $regex: safeValue, $options: 'i' } }));
      });
    }
    if (category && category !== 'All') query.category = category;
    const sorts = { low: { price: 1 }, high: { price: -1 }, rating: { rating: -1 }, popular: { numReviews: -1 }, featured: { featured: -1, createdAt: -1 } };
    const count = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sorts[sort] || sorts.featured).skip((page - 1) * limit).limit(Number(limit));
    res.json({ products, page: Number(page), pages: Math.ceil(count / limit), count });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => { try { if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found' }); const product = await Product.findById(req.params.id); product ? res.json(product) : res.status(404).json({ message: 'Product not found' }); } catch (e) { next(e); } });
router.post('/', protect, admin, async (req, res, next) => { try { res.status(201).json(await Product.create(req.body)); } catch (e) { next(e); } });
router.put('/:id', protect, admin, async (req, res, next) => { try { const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); item ? res.json(item) : res.status(404).json({ message: 'Product not found' }); } catch (e) { next(e); } });
router.delete('/:id', protect, admin, async (req, res, next) => { try { const item = await Product.findByIdAndDelete(req.params.id); item ? res.json({ message: 'Product deleted' }) : res.status(404).json({ message: 'Product not found' }); } catch (e) { next(e); } });
export default router;
