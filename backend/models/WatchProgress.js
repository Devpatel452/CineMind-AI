import mongoose from 'mongoose';

const watchProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for tracking progress'],
      index: true,
    },
    movieId: {
      type: String,
      required: [true, 'Movie ID is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    poster: {
      type: String,
      default: '',
    },
    backdrop: {
      type: String,
      default: '',
    },
    currentTime: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    lastWatched: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One progress entry per user per movie
watchProgressSchema.index({ user: 1, movieId: 1 }, { unique: true });

const WatchProgress = mongoose.model('WatchProgress', watchProgressSchema);

export default WatchProgress;
