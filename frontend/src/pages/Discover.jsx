import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Filter,
  X,
  Star,
  SlidersHorizontal,
  Film,
  Sparkles,
} from 'lucide-react';
import { allMockMovies } from '../utils/mockMovies';
import MovieCard from '../components/movie/MovieCard';

const GENRES = [
  'All',
  'Sci-Fi',
  'Action',
  'Thriller',
  'Mystery',
  'Drama',
  'Romance',
  'Crime',
  'Horror',
  'Art House',
  'Cyberpunk',
];

const Discover = ({
  watchlist = [],
  onToggleWatchlist,
  onSelectMovie,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [minRating, setMinRating] = useState('0');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('rating-desc'); // 'rating-desc' | 'year-desc' | 'title-asc' | 'match-desc'

  const watchlistIds = useMemo(
    () => new Set(watchlist.map((m) => m.movieId || m.id)),
    [watchlist]
  );

  // Filter & sort movies
  const filteredMovies = useMemo(() => {
    let result = [...allMockMovies];

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.overview.toLowerCase().includes(q) ||
          m.genres?.some((g) => g.toLowerCase().includes(q)) ||
          m.director?.toLowerCase().includes(q) ||
          m.cast?.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Genre filter
    if (selectedGenre !== 'All') {
      result = result.filter((m) =>
        m.genres?.some(
          (g) => g.toLowerCase() === selectedGenre.toLowerCase()
        )
      );
    }

    // Min rating
    const ratingThreshold = parseFloat(minRating);
    if (ratingThreshold > 0) {
      result = result.filter((m) => (m.rating || 0) >= ratingThreshold);
    }

    // Year filter
    if (selectedYear !== 'All') {
      result = result.filter(
        (m) => String(m.releaseYear) === String(selectedYear)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating-desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'year-desc') return (b.releaseYear || 0) - (a.releaseYear || 0);
      if (sortBy === 'match-desc') return (b.matchScore || 0) - (a.matchScore || 0);
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [searchTerm, selectedGenre, minRating, selectedYear, sortBy]);

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedGenre !== 'All' ||
    minRating !== '0' ||
    selectedYear !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setMinRating('0');
    setSelectedYear('All');
    setSortBy('rating-desc');
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0b0e] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title Banner */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Catalog Explorer</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Discover Movies
              </h1>
              <p className="text-sm text-gray-400 mt-1 max-w-xl">
                Browse our entire 4K Ultra HD collection with multi-parameter filtering, rating thresholds, and real-time search.
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-300 self-start sm:self-auto">
              {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'} found
            </div>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-5 bg-[#12141c]/80">
          {/* Top Row: Search Input + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, director, cast, or keywords..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-white text-xs sm:text-sm focus:border-red-500 focus:outline-none transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-400 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 rounded-2xl bg-black/60 border border-white/10 text-xs text-white focus:border-red-500 focus:outline-none transition-colors cursor-pointer"
              >
                <option value="rating-desc">Sort: Highest Rated</option>
                <option value="match-desc">Sort: AI Match Score</option>
                <option value="year-desc">Sort: Newest First</option>
                <option value="title-asc">Sort: Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Genre Filter Chips */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Filter by Genre
            </span>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => {
                const isSelected = selectedGenre === g;
                return (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 border-red-500 text-white glow-red shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filters: Rating & Year & Clear */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Rating:</span>
                </span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-gray-200 focus:border-red-500 focus:outline-none cursor-pointer"
                >
                  <option value="0">All Ratings</option>
                  <option value="8.0">8.0+ Stars</option>
                  <option value="8.5">8.5+ Stars</option>
                  <option value="9.0">9.0+ Masterpieces</option>
                </select>
              </div>

              {/* Release Year */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 font-medium">Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-gray-200 focus:border-red-500 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Years</option>
                  <option value="2025">2025 Releases</option>
                  <option value="2024">2024 Releases</option>
                  <option value="2023">2023 & Prior</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredMovies.map((movie) => (
              <div key={movie.id} className="flex justify-center">
                <MovieCard
                  movie={movie}
                  onSelectMovie={onSelectMovie}
                  isWatchlisted={watchlistIds.has(movie.id)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-4 rounded-3xl bg-[#12141c]/50 border border-white/5 p-8">
            <Film className="w-14 h-14 text-gray-500 mx-auto opacity-60" />
            <h3 className="text-xl font-bold text-white">No Movies Match Your Criteria</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Try relaxing your rating threshold, selecting 'All' genres, or clearing your search term.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold glow-red transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
