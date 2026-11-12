import express from 'express';
import {
  getPlatformStats,
  getAllUsers,
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(protect);
router.use(admin);

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);

router.route('/movies')
  .get(getAllMovies)
  .post(createMovie);

router.route('/movies/:id')
  .put(updateMovie)
  .delete(deleteMovie);

export default router;
