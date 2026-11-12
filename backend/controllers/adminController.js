import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Watchlist from '../models/Watchlist.js';
import WatchProgress from '../models/WatchProgress.js';

/**
 * @desc    Get system analytics & platform stats
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalMovies, totalWatchlist, activeStreams] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Watchlist.countDocuments(),
      WatchProgress.countDocuments({ completed: false }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        usersCount: totalUsers,
        totalMovies,
        moviesCount: totalMovies,
        totalWatchlistItems: totalWatchlist,
        watchlistCount: totalWatchlist,
        activeStreams,
        progressCount: activeStreams,
        serverUptime: `${Math.floor(process.uptime())}s`,
        systemStatus: 'Operational',
      },
    });
  } catch (error) {
    console.error('[Admin Stats Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch platform stats',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all registered users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('[Admin Users Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users list',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all custom/database movies
 * @route   GET /api/admin/movies
 * @access  Private/Admin
 */
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error('[Admin Movies Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new movie record
 * @route   POST /api/admin/movies
 * @access  Private/Admin
 */
export const createMovie = async (req, res) => {
  try {
    const {
      title,
      overview,
      poster,
      backdrop,
      videoUrl,
      tagline,
      rating,
      releaseYear,
      duration,
      genres,
      director,
      cast,
      ageRating,
    } = req.body;

    if (!title || !overview || !poster || !backdrop || !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'title, overview, poster, backdrop, and videoUrl are required',
      });
    }

    const movieId = req.body.movieId || `custom-${Date.now()}`;

    const movie = await Movie.create({
      movieId,
      title: title.trim(),
      tagline: tagline || '',
      overview: overview.trim(),
      poster: poster.trim(),
      backdrop: backdrop.trim(),
      videoUrl: videoUrl.trim(),
      rating: Number(rating) || 8.0,
      releaseYear: Number(releaseYear) || 2025,
      duration: duration || '1h 45m',
      genres: Array.isArray(genres) ? genres : ['Cinema'],
      director: director || 'Independent',
      cast: Array.isArray(cast) ? cast : [],
      ageRating: ageRating || '16+',
    });

    return res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      movie,
    });
  } catch (error) {
    console.error('[Admin Create Movie Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to create movie',
      error: error.message,
    });
  }
};

/**
 * @desc    Update movie record
 * @route   PUT /api/admin/movies/:id
 * @access  Private/Admin
 */
export const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      movie,
    });
  } catch (error) {
    console.error('[Admin Update Movie Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete movie record
 * @route   DELETE /api/admin/movies/:id
 * @access  Private/Admin
 */
export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    console.error('[Admin Delete Movie Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
      error: error.message,
    });
  }
};
