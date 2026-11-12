import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import HeroBanner from '../components/movie/HeroBanner';
import MovieRow from '../components/movie/MovieRow';
import MovieCard from '../components/movie/MovieCard';
import ContinueWatchingRow from '../components/movie/ContinueWatchingRow';
import { featuredMovie, trendingMovies, popularMovies, topRatedMovies } from '../utils/mockMovies';
import { Flame, Sparkles, Award, TrendingUp, Search, Film } from 'lucide-react';

const Home = ({
  searchQuery = '',
  watchlist = [],
  onToggleWatchlist,
  onSelectMovie,
}) => {
  const watchlistIds = useMemo(() => new Set(watchlist.map((m) => m.id)), [watchlist]);

  // Combined movies for search filtering
  const allMovies = useMemo(() => {
    const map = new Map();
    [featuredMovie, ...trendingMovies, ...popularMovies, ...topRatedMovies].forEach((m) => {
      if (!map.has(m.id)) map.set(m.id, m);
    });
    return Array.from(map.values());
  }, []);

  // Filtered movies if user is searching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allMovies.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.overview.toLowerCase().includes(query) ||
        m.genres?.some((g) => g.toLowerCase().includes(query))
    );
  }, [searchQuery, allMovies]);

  const isSearching = Boolean(searchQuery.trim());

  return (
    <div className="relative min-h-screen">
      {/* If Searching: Render Grid of Search Results */}
      {isSearching ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Search Results for <span className="text-red-500">"{searchQuery}"</span>
            </h1>
            <span className="text-xs text-gray-500 font-medium ml-2">
              ({searchResults.length} found)
            </span>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {searchResults.map((movie) => (
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
            <div className="py-24 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">No Movies Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                We couldn't find any title matching your query. Try searching for genres like "Sci-Fi", "Action", or "Drama".
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Default Netflix-inspired Cinematic Home Experience */
        <>
          {/* Top Hero Featured Movie */}
          <HeroBanner
            movie={featuredMovie}
            onOpenDetails={onSelectMovie}
            isWatchlisted={watchlistIds.has(featuredMovie.id)}
            onToggleWatchlist={onToggleWatchlist}
          />

          {/* Overlapping Movie Rows with smooth Netflix negative margin */}
          <div className="-mt-16 sm:-mt-24 relative z-30 space-y-4 sm:space-y-8 pb-12">
            {/* Continue Watching Row (if user has active video progress) */}
            <ContinueWatchingRow />

            {/* Section 1: Trending Movies */}
            <MovieRow
              title="Trending Movies"
              movies={trendingMovies}
              onSelectMovie={onSelectMovie}
              watchlistIds={watchlistIds}
              onToggleWatchlist={onToggleWatchlist}
              icon={Flame}
            />

            {/* Section 2: Popular Movies */}
            <MovieRow
              title="Popular Movies"
              movies={popularMovies}
              onSelectMovie={onSelectMovie}
              watchlistIds={watchlistIds}
              onToggleWatchlist={onToggleWatchlist}
              icon={TrendingUp}
            />

            {/* AI Recommendation Teaser Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="relative rounded-2xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-red-950/60 via-[#141724] to-black border border-red-500/20 shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" />
                      <span>Next-Gen Cinema Discovery</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      Can’t decide what to watch tonight?
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      Describe your vibe, mood, or favorite plot twists in plain words. CineMind AI will curate a personalized cinematic watchlist.
                    </p>
                  </div>

                  <Link
                    to="/ai-recommend"
                    className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 glow-red transition-all cursor-pointer flex-shrink-0"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Try AI Recommendation</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Section 3: Top Rated Movies */}
            <MovieRow
              title="Top Rated Movies"
              movies={topRatedMovies}
              onSelectMovie={onSelectMovie}
              watchlistIds={watchlistIds}
              onToggleWatchlist={onToggleWatchlist}
              icon={Award}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
