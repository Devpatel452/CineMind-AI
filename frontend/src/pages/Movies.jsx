import React, { useMemo } from 'react';
import MovieRow from '../components/movie/MovieRow';
import MovieCard from '../components/movie/MovieCard';
import { trendingMovies, popularMovies, topRatedMovies } from '../utils/mockMovies';
import { Film, Clapperboard, Sparkles } from 'lucide-react';

const Movies = ({
  watchlist = [],
  onToggleWatchlist,
  onSelectMovie,
}) => {
  const watchlistIds = useMemo(
    () => new Set(watchlist.map((m) => m.movieId || m.id)),
    [watchlist]
  );

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Featured Cinema</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            Movies Catalog
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            Explore curated blockbusters, independent masterpieces, and award-winning international cinema.
          </p>
        </div>

        {/* Rows */}
        <div className="space-y-8">
          <MovieRow
            title="Blockbuster Releases"
            movies={popularMovies}
            onSelectMovie={onSelectMovie}
            watchlistIds={watchlistIds}
            onToggleWatchlist={onToggleWatchlist}
            icon={Film}
          />

          <MovieRow
            title="Trending Sci-Fi & Action"
            movies={trendingMovies}
            onSelectMovie={onSelectMovie}
            watchlistIds={watchlistIds}
            onToggleWatchlist={onToggleWatchlist}
            icon={Sparkles}
          />

          <MovieRow
            title="Critically Acclaimed Masterpieces"
            movies={topRatedMovies}
            onSelectMovie={onSelectMovie}
            watchlistIds={watchlistIds}
            onToggleWatchlist={onToggleWatchlist}
            icon={Film}
          />
        </div>
      </div>
    </div>
  );
};

export default Movies;
