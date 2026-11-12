import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('cinemind_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error response handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Something went wrong';
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      message = 'Cannot connect to backend server. Please verify backend is running on port 5000.';
    } else if (error.message) {
      message = error.message;
    }
    console.error('[API Error]:', message);
    return Promise.reject(error);
  }
);

// Health check endpoint verification helper
export const checkBackendHealth = async () => {
  try {
    const data = await api.get('/health');
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export default api;
