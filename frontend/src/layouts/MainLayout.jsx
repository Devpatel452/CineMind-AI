import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { Film, Sparkles } from 'lucide-react';

const MainLayout = ({
  searchQuery,
  onSearchChange,
  watchlistCount = 0,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0b0e] text-gray-100 selection:bg-red-600 selection:text-white">
      {/* Sticky / Scrolled Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        watchlistCount={watchlistCount}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Netflix-style Cinematic Footer */}
      <footer className="border-t border-white/5 bg-[#07080a] pt-14 pb-10 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs text-gray-400">
            <div className="space-y-3">
              <h5 className="text-gray-200 font-bold uppercase tracking-wider text-[11px]">
                Navigation
              </h5>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-red-400 transition-colors">Home</a></li>
                <li><a href="/movies" className="hover:text-red-400 transition-colors">Movies Catalog</a></li>
                <li><a href="/tv-shows" className="hover:text-red-400 transition-colors">TV Series</a></li>
                <li><a href="/watchlist" className="hover:text-red-400 transition-colors">My Watchlist</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="text-gray-200 font-bold uppercase tracking-wider text-[11px]">
                AI Intelligence
              </h5>
              <ul className="space-y-2">
                <li><a href="/ai-recommend" className="hover:text-red-400 transition-colors">Gemini Mood Match</a></li>
                <li><a href="/ai-recommend" className="hover:text-red-400 transition-colors">Prompt Discovery</a></li>
                <li><a href="/discover" className="hover:text-red-400 transition-colors">Discover Catalog</a></li>
                <li><a href="/watchlist" className="hover:text-red-400 transition-colors">Curated Collections</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="text-gray-200 font-bold uppercase tracking-wider text-[11px]">
                Platform
              </h5>
              <ul className="space-y-2">
                <li><span className="text-gray-500">React 19 + Vite</span></li>
                <li><span className="text-gray-500">Tailwind CSS</span></li>
                <li><span className="text-gray-500">Node.js + Express API</span></li>
                <li><span className="text-gray-500">MongoDB + Mongoose</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="text-gray-200 font-bold uppercase tracking-wider text-[11px]">
                About CineMind
              </h5>
              <p className="text-gray-500 leading-relaxed text-[11px]">
                A cutting-edge movie streaming and AI recommendation interface crafted for deep cinematic discovery.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center text-white">
                <Film className="w-3 h-3" />
              </div>
              <span className="font-bold text-gray-300">CineMind AI</span>
              <span>&copy; {new Date().getFullYear()} Cinematic Intelligence Platform</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
