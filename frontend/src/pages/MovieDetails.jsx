import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Plus,
  Check,
  Star,
  Clock,
  Calendar,
  Sparkles,
  Shield,
  Film,
  ArrowLeft,
  Share2,
  Volume2,
  Monitor,
} from 'lucide-react';
import { getMovieById, allMockMovies, featuredMovie } from '../utils/mockMovies';
import MovieCard from '../components/movie/MovieCard';
import { useToast } from '../context/ToastContext';

const MovieDetails = ({
  watchlist = [],
  onToggleWatchlist,
  onSelectMovie,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imgError, setImgError] = useState(false);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const movie = useMemo(() => {
    return getMovieById(id) || featuredMovie;
  }, [id]);

  const isWatchlisted = useMemo(() => {
    return watchlist.some((item) => (item.movieId || item.id) === movie.id);
  }, [watchlist, movie.id]);

  // Similar movies based on common genres
  const similarMovies = useMemo(() => {
    const movieGenres = movie.genres || [];
    return allMockMovies
      .filter((m) => m.id !== movie.id)
      .sort((a, b) => {
        const aCommon = (a.genres || []).filter((g) => movieGenres.includes(g)).length;
        const bCommon = (b.genres || []).filter((g) => movieGenres.includes(g)).length;
        return bCommon - aCommon;
      })
      .slice(0, 5);
  }, [movie]);

  const handleToggleWatchlist = () => {
    if (onToggleWatchlist) {
      onToggleWatchlist(movie);
      if (isWatchlisted) {
        toast.info(`Removed "${movie.title}" from watchlist`);
      } else {
        toast.success(`Saved "${movie.title}" to watchlist`);
      }
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Movie link copied to clipboard');
    }
  };

  const watchlistIds = useMemo(
    () => new Set(watchlist.map((m) => m.movieId || m.id)),
    [watchlist]
  );

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-gray-100 pb-20">
      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] lg:h-[82vh] overflow-hidden">
        <img
          src={imgError ? featuredMovie.backdrop : movie.backdrop || movie.poster}
          alt={movie.title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
        />

        {/* Cinematic Netflix-style Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0e] via-[#0a0b0e]/75 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0a0b0e] via-[#0a0b0e]/80 to-transparent z-10" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0b0e]/90 to-transparent z-10" />

        {/* Back Button */}
        <div className="absolute top-24 left-4 sm:left-8 z-30">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-white/10 backdrop-blur-md text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Hero Title & Actions */}
        <div className="absolute inset-x-0 bottom-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-600 text-white text-[11px] font-black uppercase tracking-wider glow-red">
                <Sparkles className="w-3 h-3" />
                <span>CineMind Premier</span>
              </span>

              <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                {movie.matchScore || 96}% AI Match
              </span>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-500/30 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{movie.rating} / 10</span>
              </div>

              <span className="px-2 py-0.5 rounded border border-gray-600 text-[11px] text-gray-300 font-semibold uppercase">
                {movie.resolution || '4K ULTRA HD'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-sm sm:text-base text-red-400/90 font-medium italic">
                "{movie.tagline}"
              </p>
            )}

            {/* Quick Specs */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-300 font-medium">
              <span className="text-white font-semibold">{movie.releaseYear}</span>
              <span>•</span>
              <span className="px-1.5 py-0.5 border border-gray-700 rounded text-[11px] text-gray-400">
                {movie.ageRating || '16+'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {movie.duration}
              </span>
              <span>•</span>
              <span className="text-gray-400">{movie.genres?.join(', ')}</span>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={`/watch/${movie.id}`}
                className="px-7 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2.5 glow-red transition-all transform hover:scale-105 shadow-xl"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Movie</span>
              </Link>

              <button
                onClick={handleToggleWatchlist}
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

              <button
                onClick={handleShare}
                className="w-11 h-11 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Share Movie"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Two-Column Overview & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Synopsis, Cast, Director */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Film className="w-4 h-4 text-red-500" />
                <span>Story Synopsis</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
                {movie.overview}
              </p>
            </div>

            {/* Cast & Crew Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#12141c]/60 border border-white/5">
              {/* Director */}
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Director
                </span>
                <p className="text-sm font-bold text-white">
                  {movie.director || 'Marcus Sterling'}
                </p>
                <span className="text-[11px] text-gray-500">Visionary Filmmaker</span>
              </div>

              {/* Age Advisory */}
              <div className="space-y-1.5">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Maturity Rating
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded border border-gray-600 text-xs font-bold text-emerald-400">
                    {movie.ageRating || '16+'}
                  </span>
                  <span className="text-xs text-gray-400">Recommended for mature audiences</span>
                </div>
              </div>

              {/* Cast Members */}
              <div className="sm:col-span-2 space-y-2">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Starring Cast
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(movie.cast || [
                    'Kaelen Vance',
                    'Lyra Mercer',
                    'Tatsuya Mori',
                    'Elena Rostova',
                  ]).map((actor) => (
                    <div
                      key={actor}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-gray-200"
                    >
                      <div className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-[10px] font-bold">
                        {actor[0]}
                      </div>
                      <span>{actor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Recommendation Insights Pill */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950/30 via-[#141724] to-[#12141c] border border-red-500/20 space-y-2">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>CineMind AI Match Insights</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Matched based on high ratings in {movie.genres?.join(' and ')}, dynamic visual storytelling, and atmospheric narrative resonance.
              </p>
            </div>
          </div>

          {/* Right Column: Poster Card & Tech Specs */}
          <div className="space-y-6">
            {/* High-res Poster Box */}
            <div className="relative rounded-2xl overflow-hidden aspect-[2/3] max-w-[280px] mx-auto lg:mx-0 shadow-2xl border border-white/10 bg-gray-900">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    CineGrade
                  </p>
                  <p className="text-xs font-bold text-white">Master Audio / Video</p>
                </div>
                <div className="text-xs font-black text-emerald-400">
                  {movie.matchScore || 96}%
                </div>
              </div>
            </div>

            {/* Technical Audio / Video Spec Panel */}
            <div className="p-5 rounded-2xl bg-[#12141c]/60 border border-white/5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Playback Specifications
              </h3>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-gray-500" />
                    <span>Resolution</span>
                  </span>
                  <span className="font-semibold text-white">{movie.resolution || '4K UHD HDR10'}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-gray-500" />
                    <span>Spatial Audio</span>
                  </span>
                  <span className="font-semibold text-white">{movie.audio || 'Dolby Atmos 7.1'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span>Release Year</span>
                  </span>
                  <span className="font-semibold text-white">{movie.releaseYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Titles Section */}
        {similarMovies.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">More Like This</h3>
                <p className="text-xs text-gray-400">
                  Curated recommendations sharing tone, theme, and genres
                </p>
              </div>
              <Link
                to="/discover"
                className="text-xs font-semibold text-red-400 hover:text-red-300"
              >
                Explore All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {similarMovies.map((similar) => (
                <div key={similar.id} className="flex justify-center">
                  <MovieCard
                    movie={similar}
                    onSelectMovie={() => navigate(`/movie/${similar.id}`)}
                    isWatchlisted={watchlistIds.has(similar.id)}
                    onToggleWatchlist={onToggleWatchlist}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
