import api from './api';

export const adminService = {
  getStats: async () => {
    return await api.get('/admin/stats');
  },

  getUsers: async () => {
    return await api.get('/admin/users');
  },

  getMovies: async () => {
    return await api.get('/admin/movies');
  },

  addMovie: async (movieData) => {
    return await api.post('/admin/movies', movieData);
  },

  updateMovie: async (id, movieData) => {
    return await api.put(`/admin/movies/${id}`, movieData);
  },

  deleteMovie: async (id) => {
    return await api.delete(`/admin/movies/${id}`);
  },
};

export default adminService;
