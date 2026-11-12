import express from 'express';
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
} from '../controllers/watchlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All watchlist routes are protected
router.use(protect);

router.route('/')
  .get(getWatchlist)
  .post(addToWatchlist);

router.route('/:movieId')
  .delete(removeFromWatchlist);

export default router;
