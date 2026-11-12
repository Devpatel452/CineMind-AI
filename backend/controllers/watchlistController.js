
import Watchlist from '../models/Watchlist.js';

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Private
export const getWatchlist = async (req, res) => {
  try {
    const movies = await Watchlist.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      watchlist: movies
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch watchlist',
      error: error.message
    });
  }
};


// @desc    Add movie to watchlist
// @route   POST /api/watchlist
// @access  Private
export const addToWatchlist = async (req, res) => {
  try {
    const {
      movieId,
      title,
      overview,
      poster,
      backdrop,
      rating,
      releaseYear,
      duration,
      genres,
      matchScore,
      ageRating
    } = req.body;

    if (!movieId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Movie ID and title are required'
      });
    }

    const existingMovie = await Watchlist.findOne({
      user: req.user._id,
      movieId
    });

    if (existingMovie) {
      return res.status(409).json({
        success: false,
        message: 'Movie already exists in your watchlist'
      });
    }

    const movie = await Watchlist.create({
      user: req.user._id,
      movieId,
      title,
      overview,
      poster,
      backdrop,
      rating,
      releaseYear,
      duration,
      genres,
      matchScore,
      ageRating
    });

    res.status(201).json({
      success: true,
      message: 'Movie added to watchlist successfully',
      movie
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Movie already exists in your watchlist'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add movie',
      error: error.message
    });
  }
};


// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Private
export const removeFromWatchlist = async (req, res) => {
  try {
    const movie = await Watchlist.findOneAndDelete({
      user: req.user._id,
      movieId: req.params.movieId
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in your watchlist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Movie removed successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove movie',
      error: error.message
    });
  }
};
