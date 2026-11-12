import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Play,
  Plus,
  Check,
  Star,
  Film,
  Compass,
  ArrowRight,
  Info,
  RefreshCw,
  Zap,
} from 'lucide-react';
import aiService from '../services/aiService';
import { useToast } from '../context/ToastContext';

const MOODS = [
  { id: 'Happy', label: 'Feel-Good & Uplifting', emoji: '☀️', color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30' },
  { id: 'Sad', label: 'Deeply Emotional', emoji: '🌧️', color: 'from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30' },
  { id: 'Romantic', label: 'Passionate & Romantic', emoji: '🌹', color: 'from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/30' },
  { id: 'Thriller', label: 'High Stakes & Edge-of-Seat', emoji: '⚡', color: 'from-red-500/20 to-crimson-500/20 text-red-300 border-red-500/30' },
  { id: 'Motivational', label: 'Inspiring & Triumphant', emoji: '🚀', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30' },
  { id: 'Horror', label: 'Chilling & Dark', emoji: '👁️', color: 'from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30' },
  { id: 'Comedy', label: 'Witty & Laugh-Out-Loud', emoji: '🍿', color: 'from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/30' },
  { id: 'Adventure', label: 'Epic & Grand Journeys', emoji: '🧭', color: 'from-cyan-500/20 to-sky-500/20 text-cyan-300 border-cyan-500/30' },
];

const QUICK_GENRES = ['Sci-Fi', 'Action', 'Thriller', 'Drama', 'Mystery', 'Cyberpunk', 'Romance', 'Horror'];

const AIRecommend = ({
  watchlist = [],
  onToggleWatchlist,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedMood, setSelectedMood] = useState('Thriller');
  const [selectedGenres, setSelectedGenres] = useState(['Sci-Fi']);
  const [customPrompt, setCustomPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Generate recommendations on first load or button click
  const fetchRecommendations = async (mood = selectedMood, genres = selectedGenres, query = customPrompt) => {
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await aiService.getRecommendations({
        mood,
        genres,
        query,
      });

      if (res.success && Array.isArray(res.recommendations)) {
        setResults(res.recommendations);
      } else {
        toast.error('Could not retrieve AI recommendations');
      }
    } catch (err) {
      console.warn('AI recommend error:', err.message);
      toast.error('AI recommendation engine offline. Using fallback catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations('Thriller', ['Sci-Fi'], '');
  }, []);

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleToggleWatchlistMovie = (movie) => {
    if (onToggleWatchlist) {
      onToggleWatchlist(movie);
      const isWatchlisted = watchlist.some((item) => (item.movieId || item.id) === (movie.movieId || movie.id));
      if (isWatchlisted) {
        toast.info(`Removed "${movie.title}" from watchlist`);
      } else {
        toast.success(`Saved "${movie.title}" to watchlist`);
      }
    }
  };

  const isMovieWatchlisted = (movieId) => {
    return watchlist.some((item) => (item.movieId || item.id) === movieId);
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0b0e] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Hero AI Discovery Header */}
        <div className="relative rounded-3xl overflow-hidden glass-panel p-6 sm:p-10 border border-red-500/20 bg-gradient-to-r from-red-950/40 via-[#121422]/90 to-black shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Gemini Neural Cinema Engine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              AI Movie Discovery
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              Tell CineMind AI how you feel or what mood you're in. Our neural recommendation model synthesizes plot complexity, visual tone, and audience resonance to curate your ideal cinema experience.
            </p>
          </div>
        </div>

        {/* Filter & Mood Controls Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 bg-[#12141c]/80">
          {/* 1. Mood Chips Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Step 1: Choose Your Mood & Energy</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {MOODS.map((m) => {
                const isSelected = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMood(m.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-left border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-500 glow-red shadow-lg transform scale-[1.02]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-base">{m.emoji}</span>
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Genre Tags Multi-Select */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-red-500" />
              <span>Step 2: Preferred Genres (Optional)</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {QUICK_GENRES.map((g) => {
                const isSelected = selectedGenres.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => handleGenreToggle(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-600/90 border-red-500 text-white glow-red'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {isSelected ? `✓ ${g}` : g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Custom Natural Language Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Step 3: Specific Prompt or Plot Vibe (Optional)</span>
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') fetchRecommendations();
                }}
                placeholder="e.g. 'cerebral space exploration with breathtaking visuals and philosophical depth'..."
                className="w-full px-4 py-3.5 rounded-2xl bg-black/70 border border-white/15 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none transition-colors pr-36"
              />

              <button
                onClick={() => fetchRecommendations()}
                disabled={loading}
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 glow-red transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-red-600 rounded-full" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                AI Curated Recommendations
              </h2>
              {results.length > 0 && (
                <span className="text-xs text-gray-500 font-semibold ml-1">
                  ({results.length} matches)
                </span>
              )}
            </div>

            <button
              onClick={() => fetchRecommendations()}
              disabled={loading}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Picks</span>
            </button>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="rounded-3xl bg-[#141724]/60 border border-white/5 p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-video rounded-2xl bg-white/5" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-14 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Recommendations Grid */}
          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((movie) => {
                const movieId = movie.movieId || movie.id;
                const isWatchlisted = isMovieWatchlisted(movieId);

                return (
                  <div
                    key={movieId}
                    className="group rounded-3xl overflow-hidden bg-[#12141c]/90 border border-white/10 hover:border-red-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/40 flex flex-col justify-between"
                  >
                    <div>
                      {/* Movie Backdrop Thumbnail */}
                      <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                        <img
                          src={movie.backdrop || movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-black/30 to-transparent" />

                        {/* AI Match Badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-black/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-lg">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>{movie.matchScore || 97}% AI Match</span>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{movie.rating}</span>
                        </div>
                      </div>

                      {/* Movie Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                              {movie.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                              <span>{movie.releaseYear}</span>
                              <span>•</span>
                              <span>{movie.duration}</span>
                              <span>•</span>
                              <span className="text-gray-300">{movie.genres?.join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* AI Explanation Box */}
                        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/20 via-[#181a26] to-[#12141c] border border-red-500/20 text-xs text-gray-300 space-y-1">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                            Why You'll Love This:
                          </span>
                          <p className="leading-relaxed line-clamp-3">
                            {movie.aiReason ||
                              movie.overview ||
                              'A stellar cinematic recommendation fitting your requested mood and preferred genres.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="p-5 pt-0 flex items-center gap-2 border-t border-white/5 mt-2">
                      <button
                        onClick={() => navigate(`/watch/${movieId}`)}
                        className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 glow-red transition-all cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Play Movie</span>
                      </button>

                      <button
                        onClick={() => handleToggleWatchlistMovie(movie)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                          isWatchlisted
                            ? 'bg-red-600 border-red-500 text-white'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:border-white/30'
                        }`}
                        title={isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}
                      >
                        {isWatchlisted ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => navigate(`/movie/${movieId}`)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                        title="View Details"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && results.length === 0 && hasSearched && (
            <div className="py-20 text-center space-y-4 rounded-3xl bg-[#12141c]/50 border border-white/5 p-8">
              <Sparkles className="w-12 h-12 text-red-500 mx-auto opacity-70" />
              <h3 className="text-lg font-bold text-white">No Direct Matches Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Try selecting a different mood or clear your custom prompt to discover more cinema recommendations.
              </p>
              <button
                onClick={() => {
                  setSelectedMood('Thriller');
                  setCustomPrompt('');
                  fetchRecommendations('Thriller', ['Sci-Fi'], '');
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold glow-red transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommend;
