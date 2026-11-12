import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Film } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({
  title,
  movies = [],
  onSelectMovie,
  watchlistIds = new Set(),
  onToggleWatchlist,
  icon: Icon = Film,
}) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;

      rowRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-5">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-500">
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-normal text-gray-500 hidden sm:inline-block">
              ({movies.length} titles)
            </span>
          </h2>
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="text-xs text-gray-400 hover:text-red-400 font-medium transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Explore All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Row Carousel Area */}
      <div className="group/row relative">
        {/* Left Arrow Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-10 sm:w-12 h-24 sm:h-32 bg-black/80 hover:bg-red-600/90 text-white flex items-center justify-center rounded-r-xl opacity-0 group-hover/row:opacity-100 transition-all backdrop-blur-md shadow-2xl cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          onScroll={checkScrollPosition}
          className="flex items-center gap-4 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth py-2 px-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelectMovie={onSelectMovie}
              isWatchlisted={watchlistIds.has(movie.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-10 sm:w-12 h-24 sm:h-32 bg-black/80 hover:bg-red-600/90 text-white flex items-center justify-center rounded-l-xl opacity-0 group-hover/row:opacity-100 transition-all backdrop-blur-md shadow-2xl cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        )}
      </div>
    </section>
  );
};

export default MovieRow;
