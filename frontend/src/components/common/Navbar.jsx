import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Film,
  Tv,
  Bookmark,
  Search,
  X,
  Menu,
  Sparkles,
  Bell,
  User,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Shield,
  Compass,
} from 'lucide-react';

const Navbar = ({
  searchQuery = '',
  onSearchChange,
  watchlistCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  // Detect scroll to toggle transparent -> solid dark glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Film },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'AI Recommend', path: '/ai-recommend', icon: Sparkles },
    { name: 'My Watchlist', path: '/watchlist', icon: Bookmark, badge: watchlistCount > 0 ? watchlistCount : null },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0a0b0e]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-[#0a0b0e]/90 via-[#0a0b0e]/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center glow-red transition-transform group-hover:scale-105 shadow-lg">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-xl font-black tracking-wider text-white">
                  CINE<span className="text-red-600">MIND</span>
                </span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-red-600/20 text-red-400 border border-red-500/30 rounded">
                  AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'text-white font-bold'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 text-[10px] bg-red-600 text-white rounded-full font-bold">
                        {link.badge}
                      </span>
                    )}
                    {active && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-red-600 rounded-full glow-red" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Search & Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative flex items-center">
              <div
                className={`flex items-center rounded-full transition-all duration-300 border ${
                  searchOpen || searchQuery
                    ? 'w-48 sm:w-64 bg-black/80 border-red-500/60 ring-1 ring-red-500/30 px-3 py-1.5'
                    : 'w-9 h-9 sm:w-auto bg-transparent border-transparent'
                }`}
              >
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label="Toggle Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                {(searchOpen || searchQuery) && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                    placeholder="Search movies, genres..."
                    autoFocus
                    className="w-full bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none ml-2"
                  />
                )}

                {searchQuery && (
                  <button
                    onClick={() => onSearchChange && onSearchChange('')}
                    className="text-gray-400 hover:text-white cursor-pointer ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Notification Bell */}
            <button
              className="hidden sm:flex text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </button>

            {/* Authentication Buttons OR User Profile Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group"
                >
                  {/* Initials Avatar */}
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-medium text-gray-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel bg-[#12141c]/95 border border-white/10 shadow-2xl py-2 backdrop-blur-2xl animate-fadeIn z-50">
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{user.email}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
                        <Shield className="w-2.5 h-2.5" />
                        <span>{user.role || 'Member'}</span>
                      </span>
                    </div>

                    <div className="py-1">
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-950/30 transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-amber-400" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span>Profile & Account</span>
                      </Link>
                      <Link
                        to="/watchlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                        <span>My Watchlist</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all glow-red"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0f16]/98 border-b border-white/10 px-4 pt-3 pb-6 space-y-4 mt-3 backdrop-blur-2xl animate-fadeIn">
          {/* Mobile User Profile or Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{user.name}</span>
                    {user.role === 'admin' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 text-xs rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1.5"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-gray-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl bg-red-600 text-xs font-bold text-white glow-red"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search movies, TV shows, genres..."
              className="w-full bg-black/60 border border-gray-800 rounded-xl px-10 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
            />
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange && onSearchChange('')}
                className="absolute right-3 top-3 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Links List */}
          <div className="space-y-1 pt-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-red-600/20 text-red-400 font-bold border border-red-500/30'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
