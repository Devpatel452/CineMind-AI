import React, { useMemo } from 'react';
import MovieRow from '../components/movie/MovieRow';
import { topRatedMovies, trendingMovies } from '../utils/mockMovies';
import { Tv, Sparkles } from 'lucide-react';

const TVShows = ({
  watchlist = [],
  onToggleWatchlist,
  onSelectMovie,
}) => {
  const watchlistIds = useMemo(
    () => new Set(watchlist.map((m) => m.movieId || m.id)),
    [watchlist]
  );

  // Transform movies into TV show representation
  const tvSeriesTrending = useMemo(
    () =>
      trendingMovies.map((m) => ({
        ...m,
        duration: '4 Seasons',
        genres: ['TV Series', ...(m.genres || [])],
      })),
    []
  );

  const tvSeriesPopular = useMemo(
    () =>
      topRatedMovies.map((m) => ({
        ...m,
        duration: '2 Seasons',
        genres: ['Limited Series', ...(m.genres || [])],
      })),
    []
  );

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Tv className="w-3.5 h-3.5" />
            <span>Binge-Worthy Series</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            TV Shows & Series
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            From episodic sci-fi sagas to deep mystery docuseries and gripping courtroom dramas.
          </p>
        </div>

        {/* Rows */}
        <div className="space-y-8">
          <MovieRow
            title="Trending Series Tonight"
            movies={tvSeriesTrending}
            onSelectMovie={onSelectMovie}
            watchlistIds={watchlistIds}
            onToggleWatchlist={onToggleWatchlist}
            icon={Tv}
          />

          <MovieRow
            title="Top Rated Limited Series"
            movies={tvSeriesPopular}
            onSelectMovie={onSelectMovie}
            watchlistIds={watchlistIds}
            onToggleWatchlist={onToggleWatchlist}
            icon={Sparkles}
          />
        </div>
      </div>
    </div>
  );
};

export default TVShows;
