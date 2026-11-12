import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/player/VideoPlayer';
import { getVideoForMovie } from '../utils/movieVideos';
import { featuredMovie, trendingMovies, popularMovies, topRatedMovies } from '../utils/mockMovies';
import progressService from '../services/progressService';
import { useAuth } from '../context/AuthContext';
import { Film } from 'lucide-react';

const WatchPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [initialTime, setInitialTime] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Combine movie datasets to find target movie metadata
  const movie = useMemo(() => {
    const list = [featuredMovie, ...trendingMovies, ...popularMovies, ...topRatedMovies];
    return (
      list.find((m) => m.id === id || m.movieId === id) || {
        id: id || 'featured-1',
        title: 'CineMind Feature Stream',
        poster: featuredMovie.poster,
        backdrop: featuredMovie.backdrop,
      }
    );
  }, [id]);

  const videoConfig = useMemo(() => getVideoForMovie(movie.id), [movie.id]);

  // Load existing playback position if previously started
  useEffect(() => {
    let isMounted = true;

    const fetchSavedProgress = async () => {
      try {
        if (isAuthenticated) {
          const res = await progressService.getProgress();
          if (isMounted && res.success && res.progress) {
            const item = res.progress.find((p) => p.movieId === movie.id);
            if (item && item.currentTime > 5) {
              setInitialTime(item.currentTime);
            }
          }
        } else {
          // Guest mode fallback from localStorage
          const guestSaved = localStorage.getItem(`cinemind_progress_${movie.id}`);
          if (guestSaved && isMounted) {
            const parsed = JSON.parse(guestSaved);
            if (parsed.currentTime > 5) {
              setInitialTime(parsed.currentTime);
            }
          }
        }
      } catch (err) {
        console.warn('[WatchPage] Progress load warning:', err.message);
      } finally {
        if (isMounted) setLoadingProgress(false);
      }
    };

    // Fallback timer so player is never stalled by network latency
    const fallbackTimer = setTimeout(() => {
      if (isMounted) setLoadingProgress(false);
    }, 800);

    fetchSavedProgress();
    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, [movie.id, isAuthenticated]);

  // Save progress handler called by VideoPlayer
  const handleProgressUpdate = async (currentTime, duration) => {
    const payload = {
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      currentTime: Math.floor(currentTime),
      duration: Math.floor(duration),
    };

    try {
      if (isAuthenticated) {
        await progressService.saveProgress(payload);
      } else {
        localStorage.setItem(`cinemind_progress_${movie.id}`, JSON.stringify(payload));
      }
    } catch (e) {
      // Quiet background failure
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {loadingProgress ? (
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Film className="w-10 h-10 animate-spin text-red-600" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            Initializing CineMind Player...
          </span>
        </div>
      ) : (
        <VideoPlayer
          movie={movie}
          videoConfig={videoConfig}
          initialTime={initialTime}
          onProgressUpdate={handleProgressUpdate}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default WatchPage;
