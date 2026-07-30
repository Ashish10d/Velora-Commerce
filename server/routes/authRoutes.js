import express from 'express'; import jwt from 'jsonwebtoken'; import User from '../models/User.js'; import { protect } from '../middleware/auth.js';
const router = express.Router();
const tokenFor = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const userResponse = (user) => ({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
router.post('/register', async (req, res, next) => { try { const { name, email, password } = req.body; if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already in use' }); const user = await User.create({ name, email, password }); res.status(201).json({ user: userResponse(user), token: tokenFor(user) }); } catch (e) { next(e); } });
router.post('/login', async (req, res, next) => { try { const user = await User.findOne({ email: req.body.email }); if (!user || !(await user.matchPassword(req.body.password))) return res.status(401).json({ message: 'Incorrect email or password' }); res.json({ user: userResponse(user), token: tokenFor(user) }); } catch (e) { next(e); } });
router.get('/me', protect, (req, res) => res.json(req.user));
export default router;
