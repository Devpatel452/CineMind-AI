import express from 'express';
import {
  getProgress,
  saveProgress,
  deleteProgress,
} from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All progress routes require user authentication
router.use(protect);

router.route('/')
  .get(getProgress)
  .post(saveProgress);

router.route('/:movieId')
  .delete(deleteProgress);

export default router;
