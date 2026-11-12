import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Star, Info } from 'lucide-react';

const MovieCard = ({
  movie,
  onSelectMovie,
  isWatchlisted = false,
  onToggleWatchlist,
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

  const handleCardClick = () => {
    if (onSelectMovie) {
      onSelectMovie(movie);
    } else {
      navigate(`/movie/${movie.id || movie.movieId}`);
    }
  };

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (onToggleWatchlist) {
      onToggleWatchlist(movie);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    navigate(`/watch/${movie.id || movie.movieId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 w-[180px] sm:w-[220px] md:w-[240px] rounded-xl overflow-hidden bg-[#141721] cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:z-30 hover:shadow-2xl hover:shadow-red-950/40 border border-white/5 hover:border-red-600/50"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-900">
        <img
          src={imgError ? fallbackImage : movie.poster}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle Dark Vignette at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141721] via-transparent to-black/20 opacity-90 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            {movie.matchScore}% Match
          </span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating}</span>
          </div>
        </div>

        {/* Hover Quick Actions Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/70 to-transparent flex flex-col justify-end p-3.5 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Action Buttons Row */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handlePlayClick}
              className="w-8 h-8 rounded-full bg-white hover:bg-red-600 text-black hover:text-white flex items-center justify-center transition-all shadow-lg transform hover:scale-110 cursor-pointer"
              title="Play Movie"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>

            <button
              onClick={handleWatchlistClick}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-lg transform hover:scale-110 cursor-pointer ${
                isWatchlisted
                  ? 'bg-red-600 border-red-500 text-white'
                  : 'bg-black/60 border-white/30 text-white hover:border-red-500 hover:text-red-400'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {isWatchlisted ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectMovie) onSelectMovie(movie);
              }}
              className="w-8 h-8 rounded-full bg-black/60 border border-white/30 hover:border-white text-white flex items-center justify-center transition-all shadow-lg ml-auto cursor-pointer"
              title="View Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Specs */}
          <div className="flex items-center gap-2 text-[11px] text-gray-300 font-medium mb-1">
            <span className="text-emerald-400 font-bold">{movie.releaseYear}</span>
            <span className="px-1 py-0.2 border border-gray-600 rounded text-[9px] text-gray-400">
              {movie.ageRating || '16+'}
            </span>
            <span>{movie.duration}</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 text-[10px] text-gray-400">
            {movie.genres?.slice(0, 2).map((g) => (
              <span key={g} className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Title */}
      <div className="p-3">
        <h4 className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span>{movie.genres?.[0] || 'Cinema'}</span>
          <span>{movie.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
