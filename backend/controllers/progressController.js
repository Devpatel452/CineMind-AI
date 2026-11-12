import WatchProgress from '../models/WatchProgress.js';

/**
 * @desc    Get user's continue watching items
 * @route   GET /api/progress
 * @access  Private
 */
export const getProgress = async (req, res) => {
  try {
    const items = await WatchProgress.find({
      user: req.user._id,
      completed: false, // Only items not yet completed
    }).sort({ lastWatched: -1 });

    return res.status(200).json({
      success: true,
      count: items.length,
      progress: items,
    });
  } catch (error) {
    console.error('[GetProgress Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch continue watching progress',
      error: error.message,
    });
  }
};

/**
 * @desc    Save or update movie playback progress
 * @route   POST /api/progress
 * @access  Private
 */
export const saveProgress = async (req, res) => {
  try {
    const { movieId, title, poster, backdrop, currentTime, duration } = req.body;

    if (!movieId || !title || currentTime === undefined || !duration) {
      return res.status(400).json({
        success: false,
        message: 'movieId, title, currentTime, and duration are required',
      });
    }

    const current = Math.max(0, Number(currentTime));
    const total = Math.max(1, Number(duration));
    const progressPercentage = Math.min(100, Math.round((current / total) * 100));
    const completed = progressPercentage >= 92; // If watched 92%+, considered completed

    const item = await WatchProgress.findOneAndUpdate(
      { user: req.user._id, movieId },
      {
        user: req.user._id,
        movieId,
        title,
        poster: poster || '',
        backdrop: backdrop || '',
        currentTime: current,
        duration: total,
        progressPercentage,
        completed,
        lastWatched: new Date(),
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Playback progress saved',
      progress: item,
    });
  } catch (error) {
    console.error('[SaveProgress Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to save playback progress',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete movie from continue watching
 * @route   DELETE /api/progress/:movieId
 * @access  Private
 */
export const deleteProgress = async (req, res) => {
  try {
    const { movieId } = req.params;

    const item = await WatchProgress.findOneAndDelete({
      user: req.user._id,
      movieId,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in continue watching list',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Removed from continue watching',
    });
  } catch (error) {
    console.error('[DeleteProgress Error]:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete continue watching item',
      error: error.message,
    });
  }
};
