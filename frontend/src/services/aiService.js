import api from './api';

export const aiService = {
  getMoods: async () => {
    return await api.get('/ai/moods');
  },

  getRecommendations: async ({ mood, genres = [], query = '' }) => {
    return await api.post('/ai/recommend', { mood, genres, query });
  },
};

export default aiService;
