import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/movie/MovieCard';
import { Bookmark, Film, Plus } from 'lucide-react';

const Watchlist = ({
  watchlist = [],
  onToggleWatchlist,
  onSelectMovie,
}) => {
  const normalizedWatchlist = useMemo(() => {
    return watchlist.map((m) => ({
      ...m,
      id: m.movieId || m.id,
    }));
  }, [watchlist]);

  const watchlistIds = useMemo(
    () => new Set(normalizedWatchlist.map((m) => m.id)),
    [normalizedWatchlist]
  );

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Collection</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
              My Watchlist
            </h1>
            <span className="text-sm font-semibold text-gray-400 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
              {normalizedWatchlist.length} {normalizedWatchlist.length === 1 ? 'title' : 'titles'}
            </span>
          </div>
          <p className="text-sm text-gray-400 max-w-xl">
            Movies and series you've bookmarked to watch later.
          </p>
        </div>

        {/* Content */}
        {normalizedWatchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pt-4">
            {normalizedWatchlist.map((movie) => (
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
          <div className="py-24 text-center space-y-5 rounded-2xl bg-[#12141c]/50 border border-white/5 p-8">
            <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Your Watchlist is Empty</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Explore trending movies and click the <span className="text-red-400 font-semibold">+ Add to Watchlist</span> button to save titles here.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs glow-red transition-all"
            >
              <Film className="w-4 h-4" />
              <span>Browse Movies</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
