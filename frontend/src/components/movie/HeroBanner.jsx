import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Info, Plus, Check, Star, Volume2, VolumeX, Sparkles } from 'lucide-react';

const HeroBanner = ({
  movie,
  onOpenDetails,
  isWatchlisted = false,
  onToggleWatchlist,
}) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);

  if (!movie) return null;

  return (
    <div className="relative w-full h-[75vh] sm:h-[82vh] lg:h-[88vh] overflow-hidden">
      {/* Background Cinematic Image */}
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.1] scale-100 transition-transform duration-1000 ease-out"
        />

        {/* Gradient Overlays for High-End Cinematic Netflix Look */}
        {/* Left Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0e] via-[#0a0b0e]/85 to-transparent w-full md:w-3/4 z-10" />

        {/* Bottom Seamless Fade into Page Background */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/70 to-transparent z-10" />

        {/* Top Vignette for Navbar Contrast */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0b0e]/90 to-transparent z-10" />
      </div>

      {/* Hero Content Information */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        <div className="max-w-2xl space-y-4">
          {/* Top Brand & Match Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black uppercase tracking-widest shadow-md glow-red">
              <Sparkles className="w-3 h-3" />
              <span>CineMind Featured</span>
            </span>

            <span className="px-2.5 py-1 rounded-md bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 text-xs font-bold tracking-wide">
              {movie.matchScore}% Match
            </span>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950/70 text-amber-300 border border-amber-500/30 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{movie.rating} / 10</span>
            </div>

            <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-gray-600 text-[11px] text-gray-300 uppercase tracking-wider font-semibold">
              {movie.resolution || '4K ULTRA HD'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
            {movie.title}
          </h1>

          {/* Tagline */}
          {movie.tagline && (
            <p className="text-sm sm:text-base text-red-400/90 font-medium italic tracking-wide">
              "{movie.tagline}"
            </p>
          )}

          {/* Quick Metadata Bar */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-300 font-medium">
            <span className="text-white font-semibold">{movie.releaseYear}</span>
            <span>•</span>
            <span className="px-1.5 py-0.5 border border-gray-700 rounded text-[11px] text-gray-400">
              {movie.ageRating || '16+'}
            </span>
            <span>•</span>
            <span>{movie.duration}</span>
            <span>•</span>
            <span className="text-gray-400">
              {movie.genres?.join(', ')}
            </span>
          </div>

          {/* Overview Description */}
          <p className="text-xs sm:text-sm md:text-base text-gray-300 font-normal leading-relaxed line-clamp-3 max-w-xl drop-shadow">
            {movie.overview}
          </p>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Play Button */}
            <button
              onClick={() => navigate(`/watch/${movie.id}`)}
              className="px-6 sm:px-8 py-3 rounded-xl bg-white hover:bg-gray-200 text-black font-bold text-sm flex items-center gap-2.5 transition-all transform hover:scale-105 shadow-xl cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Play Movie</span>
            </button>

            {/* Watchlist Toggle */}
            <button
              onClick={() => onToggleWatchlist && onToggleWatchlist(movie)}
              className={`px-5 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md border ${
                isWatchlisted
                  ? 'bg-red-600/90 text-white border-red-500 glow-red'
                  : 'bg-black/60 hover:bg-black/80 text-white border-white/20 hover:border-white/40'
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

            {/* More Info Button */}
            <button
              onClick={() => onOpenDetails && onOpenDetails(movie)}
              className="px-5 py-3 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-200 hover:text-white border border-gray-700/60 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
            >
              <Info className="w-4 h-4" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sound / Controls Indicator */}
      <div className="absolute right-4 sm:right-8 bottom-20 z-20 hidden md:flex items-center gap-3">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="w-10 h-10 rounded-full border border-white/20 bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-xs font-semibold text-gray-300 backdrop-blur-md">
          {movie.audio || 'Dolby Atmos'}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
