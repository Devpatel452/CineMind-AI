import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      required: [true, 'Movie ID is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
      trim: true,
    },
    overview: {
      type: String,
      required: [true, 'Movie overview is required'],
      trim: true,
    },
    poster: {
      type: String,
      required: [true, 'Poster image URL is required'],
      trim: true,
    },
    backdrop: {
      type: String,
      required: [true, 'Backdrop image URL is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Playable video URL is required'],
      trim: true,
    },
    trailerUrl: {
      type: String,
      default: '',
      trim: true,
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10,
    },
    releaseYear: {
      type: Number,
      default: 2024,
    },
    duration: {
      type: String,
      default: '1h 45m',
    },
    ageRating: {
      type: String,
      default: 'PG-13',
    },
    resolution: {
      type: String,
      default: '1080p Full HD',
    },
    audio: {
      type: String,
      default: 'Stereo 2.0',
    },
    genres: {
      type: [String],
      default: ['Sci-Fi', 'Adventure'],
    },
    director: {
      type: String,
      default: 'Independent Director',
    },
    cast: {
      type: [String],
      default: [],
    },
    matchScore: {
      type: Number,
      default: 95,
      min: 50,
      max: 100,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isTopRated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
