import express from 'express'; import Order from '../models/Order.js'; import { protect, admin } from '../middleware/auth.js';
const router = express.Router();
router.post('/', protect, async (req, res, next) => { try { const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body; if (!orderItems?.length) return res.status(400).json({ message: 'No order items' }); res.status(201).json(await Order.create({ user: req.user._id, orderItems, shippingAddress, paymentMethod, totalPrice })); } catch (e) { next(e); } });
router.get('/myorders', protect, async (req, res, next) => { try { res.json(await Order.find({ user: req.user._id }).sort('-createdAt')); } catch (e) { next(e); } });
router.get('/', protect, admin, async (req, res, next) => { try { res.json(await Order.find({}).populate('user', 'name email').sort('-createdAt')); } catch (e) { next(e); } });
router.put('/:id/pay', protect, async (req, res, next) => { try { const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ message: 'Order not found' }); order.isPaid = true; order.paidAt = new Date(); res.json(await order.save()); } catch (e) { next(e); } });
router.put('/:id/deliver', protect, admin, async (req, res, next) => { try { const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ message: 'Order not found' }); order.isDelivered = true; order.deliveredAt = new Date(); res.json(await order.save()); } catch (e) { next(e); } });
export default router;
