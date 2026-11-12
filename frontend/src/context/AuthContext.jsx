import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('cinemind_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session from token on initial app load
  useEffect(() => {
    let isMounted = true;

    const restoreUser = async () => {
      const storedToken = localStorage.getItem('cinemind_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (isMounted && res.success && res.user) {
            setUser(res.user);
            setToken(storedToken);
          }
        } catch (err) {
          console.warn('[AuthContext] Stored session invalid or expired');
          localStorage.removeItem('cinemind_token');
          if (isMounted) {
            setUser(null);
            setToken(null);
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    restoreUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Register function
  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await authService.register({ name, email, password });
      if (res.success && res.token) {
        localStorage.setItem('cinemind_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || err.message === 'Network Error'
          ? 'Cannot connect to server. Please verify the backend is running.'
          : err.message || 'Registration failed');
      setError(message);
      return { success: false, message };
    }
  };

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authService.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('cinemind_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' || err.message === 'Network Error'
          ? 'Cannot connect to server. Please verify the backend is running.'
          : err.message || 'Invalid credentials');
      setError(message);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('cinemind_token');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setError(null);
  };

  // Direct state updater for user profile
  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : updatedFields));
  };

  // Update profile via API and update state
  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Profile update failed' };
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Profile update failed';
      return { success: false, message };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    updateUser,
    updateProfile,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
