import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Play, Plus, Check, Star, Calendar, Clock, Film, Sparkles, Volume2, ExternalLink } from 'lucide-react';

const MovieModal = ({
  movie,
  onClose,
  isWatchlisted = false,
  onToggleWatchlist,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden bg-[#12141c] border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Backdrop / Banner */}
        <div className="relative h-60 sm:h-80 w-full overflow-hidden flex-shrink-0 bg-gray-950">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover filter brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-[#12141c]/50 to-transparent" />

          {/* Quick Actions in Banner */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  navigate(`/watch/${movie.id}`);
                }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-200 text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play Movie</span>
              </button>

              <button
                onClick={() => onToggleWatchlist && onToggleWatchlist(movie)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                  isWatchlisted
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-black/60 border-white/30 text-white hover:border-white'
                }`}
              >
                {isWatchlisted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate(`/movie/${movie.id}`);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Full Details Page"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Details</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/70 border border-white/10 text-xs font-semibold text-gray-300">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              <span>CineMind AI Match: {movie.matchScore || 95}%</span>
            </div>
          </div>
        </div>

        {/* Modal Body Info (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header Title & Badges */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {movie.title}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300 font-medium">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{movie.rating} / 10</span>
              </div>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">{movie.matchScore}% Match</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{movie.releaseYear}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{movie.duration}</span>
              </span>
              <span>•</span>
              <span className="px-1.5 py-0.5 rounded border border-gray-700 text-[10px] text-gray-400">
                {movie.ageRating || '16+'}
              </span>
            </div>
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400">
              Synopsis
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {movie.overview}
            </p>
          </div>

          {/* Genres & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5 text-xs">
            <div>
              <span className="text-gray-500 font-medium">Genres:</span>{' '}
              <span className="text-gray-200">{movie.genres?.join(', ') || 'Feature Film'}</span>
            </div>
            {movie.cast && (
              <div>
                <span className="text-gray-500 font-medium">Starring:</span>{' '}
                <span className="text-gray-200">{movie.cast.join(', ')}</span>
              </div>
            )}
            {movie.director && (
              <div>
                <span className="text-gray-500 font-medium">Director:</span>{' '}
                <span className="text-gray-200">{movie.director}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 font-medium">Audio & Subtitles:</span>{' '}
              <span className="text-gray-200">English [Original], Dolby Atmos 7.1, 40+ Languages</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
