import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for a watchlist item'],
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
    overview: {
      type: String,
      default: '',
      trim: true,
    },
    poster: {
      type: String,
      default: '',
      trim: true,
    },
    backdrop: {
      type: String,
      default: '',
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    releaseYear: {
      type: mongoose.Schema.Types.Mixed,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    genres: {
      type: [String],
      default: [],
    },
    matchScore: {
      type: Number,
      default: 95,
    },
    ageRating: {
      type: String,
      default: '16+',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate movie entries for the same user
watchlistSchema.index({ user: 1, movieId: 1 }, { unique: true });

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

export default Watchlist;
