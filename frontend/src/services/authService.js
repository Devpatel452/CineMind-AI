import api from './api';

export const authService = {
  /**
   * Register a new user
   * @param {{ name: string, email: string, password: string }} userData
   */
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  /**
   * Authenticate an existing user
   * @param {{ email: string, password: string }} credentials
   */
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  /**
   * Fetch currently logged-in user profile with JWT
   */
  getMe: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Update user profile details (name, bio, favoriteGenres)
   */
  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData);
  },
};

export default authService;
