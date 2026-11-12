import api from './api';

export const progressService = {
  getProgress: async () => {
    return await api.get('/progress');
  },

  saveProgress: async (progressData) => {
    return await api.post('/progress', progressData);
  },

  deleteProgress: async (movieId) => {
    return await api.delete(`/progress/${movieId}`);
  },
};

export default progressService;
