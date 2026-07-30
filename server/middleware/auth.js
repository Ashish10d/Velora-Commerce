import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try { req.user = await User.findById(jwt.verify(token, process.env.JWT_SECRET).id).select('-password'); next(); }
  catch { res.status(401).json({ message: 'Invalid or expired token' }); }
};
export const admin = (req, res, next) => req.user?.isAdmin ? next() : res.status(403).json({ message: 'Admin access required' });
