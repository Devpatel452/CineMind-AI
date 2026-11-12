import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import TVShows from './pages/TVShows';
import Watchlist from './pages/Watchlist';
import Discover from './pages/Discover';
import MovieDetails from './pages/MovieDetails';
import AIRecommend from './pages/AIRecommend';
import WatchPage from './pages/WatchPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import MovieModal from './components/movie/MovieModal';
import { trendingMovies } from './utils/mockMovies';
import watchlistService from './services/watchlistService';

function App() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Watchlist state initialized from localStorage with initial sample favorites
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem('cinemind_watchlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading watchlist from localStorage', e);
    }
    return [trendingMovies[0], trendingMovies[1]].filter(Boolean);
  });

  // Load user's watchlist from MongoDB when authenticated
  useEffect(() => {
    let isMounted = true;
    const fetchUserWatchlist = async () => {
      if (isAuthenticated) {
        try {
          const res = await watchlistService.getWatchlist();
          if (isMounted && res.success && Array.isArray(res.watchlist)) {
            setWatchlist(res.watchlist);
          }
        } catch (err) {
          console.warn('Failed to fetch user watchlist from backend:', err.message);
        }
      }
    };

    fetchUserWatchlist();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user]);

  // Sync to localStorage for guests
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem('cinemind_watchlist', JSON.stringify(watchlist));
      } catch (e) {
        console.error('Error saving watchlist to localStorage', e);
      }
    }
  }, [watchlist, isAuthenticated]);

  const handleToggleWatchlist = async (movie) => {
    if (!movie) return;
    const movieId = movie.movieId || movie.id;
    const exists = watchlist.some((item) => (item.movieId || item.id) === movieId);

    if (isAuthenticated) {
      try {
        if (exists) {
          // Remove from MongoDB
          await watchlistService.removeFromWatchlist(movieId);
          setWatchlist((prev) => prev.filter((item) => (item.movieId || item.id) !== movieId));
          toast.info(`Removed "${movie.title}" from watchlist`);
        } else {
          // Add to MongoDB
          const res = await watchlistService.addToWatchlist(movie);
          if (res.success && res.item) {
            setWatchlist((prev) => [...prev, res.item]);
          } else {
            setWatchlist((prev) => [...prev, movie]);
          }
          toast.success(`Saved "${movie.title}" to watchlist`);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update watchlist');
      }
    } else {
      // Guest mode
      if (exists) {
        setWatchlist((prev) => prev.filter((item) => (item.movieId || item.id) !== movieId));
        toast.info(`Removed "${movie.title}" from guest watchlist`);
      } else {
        setWatchlist((prev) => [...prev, movie]);
        toast.success(`Saved "${movie.title}" to guest watchlist`);
      }
    }
  };

  const isMovieWatchlisted = (movieId) => {
    return watchlist.some((item) => (item.movieId || item.id) === movieId);
  };

  return (
    <>
      <Routes>
        {/* Fullscreen Video Player without navbar/footer chrome */}
        <Route path="/watch/:id" element={<WatchPage />} />

        {/* Standard Layout Pages */}
        <Route
          element={
            <MainLayout
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              watchlistCount={watchlist.length}
            />
          }
        >
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Home
                searchQuery={searchQuery}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSelectMovie={setSelectedMovie}
              />
            }
          />
          <Route
            path="/discover"
            element={
              <Discover
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSelectMovie={setSelectedMovie}
              />
            }
          />
          <Route
            path="/movie/:id"
            element={
              <MovieDetails
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSelectMovie={setSelectedMovie}
              />
            }
          />
          <Route
            path="/ai-recommend"
            element={
              <AIRecommend
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
              />
            }
          />
          <Route
            path="/movies"
            element={
              <Movies
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSelectMovie={setSelectedMovie}
              />
            }
          />
          <Route
            path="/tv-shows"
            element={
              <TVShows
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                onSelectMovie={setSelectedMovie}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onSelectMovie={setSelectedMovie}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile
                  watchlistCount={watchlist.length}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  onSelectMovie={setSelectedMovie}
                />
              </ProtectedRoute>
            }
          />

          {/* Admin Role Protected Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      {/* Interactive Netflix-style Movie Details Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isWatchlisted={isMovieWatchlisted(selectedMovie.movieId || selectedMovie.id)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}
    </>
  );
}

export default App;
