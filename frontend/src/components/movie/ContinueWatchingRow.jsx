import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, X, Clock, Sparkles } from 'lucide-react';
import progressService from '../../services/progressService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  }
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const ContinueWatchingRow = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load progress items
  useEffect(() => {
    let isMounted = true;

    const fetchProgress = async () => {
      try {
        if (isAuthenticated) {
          const res = await progressService.getProgress();
          if (isMounted && res.success && Array.isArray(res.progress)) {
            // Filter out completed or tiny progress
            const active = res.progress.filter(
              (p) => !p.completed && p.currentTime > 5 && p.duration > 0
            );
            setItems(active);
          }
        } else {
          // Read from localStorage for guest
          const guestItems = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('cinemind_progress_')) {
              try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data && data.currentTime > 5 && data.duration > 0 && !data.completed) {
                  guestItems.push(data);
                }
              } catch (e) {}
            }
          }
          if (isMounted) setItems(guestItems);
        }
      } catch (err) {
        console.warn('[ContinueWatching] Load warning:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProgress();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleRemove = async (e, movieId) => {
    e.stopPropagation();
    try {
      if (isAuthenticated) {
        await progressService.deleteProgress(movieId);
      } else {
        localStorage.removeItem(`cinemind_progress_${movieId}`);
      }
      setItems((prev) => prev.filter((item) => item.movieId !== movieId));
      toast.info('Removed from Continue Watching');
    } catch (err) {
      toast.error('Failed to remove progress');
    }
  };

  if (loading || items.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-5 bg-red-600 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Continue Watching
          </h2>
          <span className="text-xs text-gray-500 font-medium ml-1">
            ({items.length})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-3 pt-1">
        {items.map((item) => {
          const percent = Math.min(
            100,
            Math.max(
              2,
              item.progressPercentage ||
                Math.round((item.currentTime / (item.duration || 1)) * 100)
            )
          );

          return (
            <div
              key={item.movieId}
              onClick={() => navigate(`/watch/${item.movieId}`)}
              className="group relative flex-shrink-0 w-[240px] sm:w-[280px] rounded-xl overflow-hidden bg-[#141724] border border-white/5 hover:border-red-600/40 transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-lg hover:shadow-red-950/30"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                <img
                  src={
                    item.backdrop ||
                    item.poster ||
                    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                />

                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-70 group-hover:opacity-40 transition-opacity" />

                {/* Center Play Button Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl glow-red transform group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Remove Progress Button */}
                <button
                  onClick={(e) => handleRemove(e, item.movieId)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-colors border border-white/10 z-10"
                  title="Remove from Continue Watching"
                  aria-label="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Progress Bar along bottom of video thumbnail */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gray-700/80">
                  <div
                    className="h-full bg-red-600 glow-red transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Title & Time Info */}
              <div className="p-3">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                  {item.title || 'Untitled Stream'}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>{formatDuration(item.currentTime)} left</span>
                  </span>
                  <span className="text-gray-500 font-semibold">{percent}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ContinueWatchingRow;
