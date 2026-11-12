import api from './api';

export const watchlistService = {
  getWatchlist: async () => {
    return await api.get('/watchlist');
  },

  addToWatchlist: async (movie) => {
    const payload = {
      movieId: movie.movieId || movie.id,
      title: movie.title,
      overview: movie.overview || '',
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      rating: movie.rating || 0,
      releaseYear: movie.releaseYear || '',
      duration: movie.duration || '',
      genres: movie.genres || [],
      matchScore: movie.matchScore || 95,
      ageRating: movie.ageRating || '16+',
    };
    return await api.post('/watchlist', payload);
  },

  removeFromWatchlist: async (movieId) => {
    return await api.delete(`/watchlist/${movieId}`);
  },
};

export default watchlistService;
