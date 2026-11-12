import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Film,
  Bookmark,
  Sparkles,
  LogOut,
  Edit3,
  Clock,
  Play,
  Check,
  Save,
  Tag,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import progressService from '../services/progressService';
import MovieCard from '../components/movie/MovieCard';

const AVAILABLE_GENRES = [
  'Action',
  'Sci-Fi',
  'Cyberpunk',
  'Thriller',
  'Mystery',
  'Drama',
  'Romance',
  'Horror',
  'Comedy',
  'Adventure',
  'Fantasy',
  'Crime',
];

const Profile = ({
  watchlistCount = 0,
  watchlist = [],
  onToggleWatchlist,
  onSelectMovie,
}) => {
  const { user, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'watchlist' | 'continue' | 'edit'
  const [continueItems, setContinueItems] = useState([]);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Edit form state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [favoriteGenres, setFavoriteGenres] = useState(user?.favoriteGenres || []);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setFavoriteGenres(user.favoriteGenres || []);
    }
  }, [user]);

  // Load continue watching progress
  useEffect(() => {
    let isMounted = true;
    const fetchProgress = async () => {
      setLoadingProgress(true);
      try {
        const res = await progressService.getProgress();
        if (isMounted && res.success && Array.isArray(res.progress)) {
          setContinueItems(res.progress.filter((p) => !p.completed && p.currentTime > 5));
        }
      } catch (err) {
        console.warn('Profile progress error:', err.message);
      } finally {
        if (isMounted) setLoadingProgress(false);
      }
    };

    fetchProgress();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenreToggle = (genre) => {
    setFavoriteGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    const result = await updateProfile({
      name: name.trim(),
      bio: bio.trim(),
      favoriteGenres,
    });
    setIsSaving(false);

    if (result.success) {
      toast.success('Profile updated successfully');
      setActiveTab('overview');
    } else {
      toast.error(result.message || 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0b0e] text-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Banner */}
        <div className="relative rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 overflow-hidden shadow-2xl bg-gradient-to-br from-[#141724]/90 via-[#0e1017]/95 to-black">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar Pill */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 p-0.5 shadow-2xl glow-red flex-shrink-0">
              <div className="w-full h-full bg-[#12141c] rounded-[14px] flex items-center justify-center text-4xl font-black text-white">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </div>

            {/* User Meta */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/30">
                  <Shield className="w-3 h-3" />
                  <span>{user.role || 'Member'}</span>
                </span>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                  >
                    <span>Admin Panel</span>
                  </Link>
                )}
              </div>

              <p className="text-sm text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>{user.email}</span>
              </p>

              {user.bio ? (
                <p className="text-xs sm:text-sm text-gray-300 italic pt-1 max-w-lg">
                  "{user.bio}"
                </p>
              ) : (
                <p className="text-xs text-gray-500 italic pt-1">
                  No bio yet. Click "Edit Profile" to add your cinema bio.
                </p>
              )}

              {/* Favorite Genres Pills */}
              {user.favoriteGenres && user.favoriteGenres.length > 0 && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
                  {user.favoriteGenres.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-gray-300 font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 pt-2">
                <Calendar className="w-3 h-3 text-gray-600" />
                <span>
                  Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex sm:flex-col gap-2">
              <button
                onClick={() => setActiveTab('edit')}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-red-500" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white glow-red shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview & Stats
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'watchlist'
                ? 'bg-red-600 text-white glow-red shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            My Watchlist ({watchlistCount})
          </button>
          <button
            onClick={() => setActiveTab('continue')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'continue'
                ? 'bg-red-600 text-white glow-red shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Continue Watching ({continueItems.length})
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-red-600 text-white glow-red shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs uppercase tracking-wider font-semibold">Watchlist</span>
                  <Bookmark className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-black text-white">{watchlistCount}</div>
                <p className="text-[11px] text-gray-500">Saved movies & series</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs uppercase tracking-wider font-semibold">In Progress</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white">{continueItems.length}</div>
                <p className="text-[11px] text-gray-500">Active playback sessions</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
                <div className="flex items-center justify-between text-gray-400">
                  <span className="text-xs uppercase tracking-wider font-semibold">Streaming Tier</span>
                  <Film className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white">4K ULTRA HD</div>
                <p className="text-[11px] text-gray-500">Dolby Atmos enabled</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Explore CineMind AI
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/ai-recommend"
                  className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-xs font-semibold text-red-400 border border-red-500/30 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <span>AI Mood Matcher</span>
                </Link>
                <Link
                  to="/discover"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/10 flex items-center gap-2"
                >
                  <Film className="w-4 h-4 text-gray-400" />
                  <span>Discover Catalog</span>
                </Link>
                <Link
                  to="/watchlist"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-200 border border-white/10 flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-gray-400" />
                  <span>Manage Watchlist</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WATCHLIST */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6 animate-fadeIn">
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {watchlist.map((m) => (
                  <div key={m.movieId || m.id} className="flex justify-center">
                    <MovieCard
                      movie={{ ...m, id: m.movieId || m.id }}
                      onSelectMovie={onSelectMovie}
                      isWatchlisted={true}
                      onToggleWatchlist={onToggleWatchlist}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 rounded-2xl bg-[#12141c]/50 border border-white/5 p-8">
                <Bookmark className="w-12 h-12 text-red-500 mx-auto opacity-70" />
                <h3 className="text-lg font-bold text-white">Your Watchlist is Empty</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Browse movies and add your favorite titles to your personal collection.
                </p>
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold glow-red transition-all"
                >
                  <span>Browse Catalog</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTINUE WATCHING */}
        {activeTab === 'continue' && (
          <div className="space-y-6 animate-fadeIn">
            {continueItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {continueItems.map((item) => (
                  <div
                    key={item.movieId}
                    onClick={() => navigate(`/watch/${item.movieId}`)}
                    className="p-4 rounded-2xl bg-[#12141c]/80 border border-white/5 hover:border-red-600/40 transition-all cursor-pointer group"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-950 mb-3">
                      <img
                        src={
                          item.backdrop ||
                          item.poster ||
                          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gray-700">
                        <div
                          className="h-full bg-red-600"
                          style={{ width: `${item.progressPercentage || 10}%` }}
                        />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.progressPercentage || 0}% watched • Click to Resume
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 rounded-2xl bg-[#12141c]/50 border border-white/5 p-8">
                <Clock className="w-12 h-12 text-gray-500 mx-auto opacity-70" />
                <h3 className="text-lg font-bold text-white">No In-Progress Titles</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  When you watch movies and pause, your playback position will be preserved here automatically.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: EDIT PROFILE */}
        {activeTab === 'edit' && (
          <form
            onSubmit={handleSaveProfile}
            className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 max-w-2xl mx-auto animate-fadeIn"
          >
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Edit Profile Details</h2>
              <p className="text-xs text-gray-400">
                Update your display name, cinema bio, and favorite genres for AI personalization.
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                placeholder="Your Name"
              />
            </div>

            {/* Cinema Bio */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Cinema Bio / Tagline
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={240}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-sm focus:border-red-500 focus:outline-none transition-colors resize-none"
                placeholder="e.g., Sci-Fi and neo-noir enthusiast. Always hunting for complex plot twists."
              />
              <span className="text-[10px] text-gray-500 float-right">
                {bio.length} / 240 characters
              </span>
            </div>

            {/* Favorite Genres Selection */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-red-500" />
                <span>Favorite Genres (Personalizes Recommendations)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_GENRES.map((g) => {
                  const isSelected = favoriteGenres.includes(g);
                  return (
                    <button
                      type="button"
                      key={g}
                      onClick={() => handleGenreToggle(g)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 border-red-500 text-white glow-red'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      {isSelected ? `✓ ${g}` : g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 glow-red transition-all cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
