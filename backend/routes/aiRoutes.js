import express from 'express';
import { getRecommendations, getMoods } from '../controllers/aiController.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Optional auth middleware so guests can use AI, but logged-in users get personalizations
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

router.get('/moods', getMoods);
router.post('/recommend', optionalAuth, getRecommendations);

export default router;
