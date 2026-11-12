import React, { useState, useEffect } from 'react';
import {
  Shield,
  Film,
  Users,
  Bookmark,
  Activity,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  X,
  Save,
  CheckCircle,
  AlertCircle,
  Play,
} from 'lucide-react';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { toast } = useToast();

  const [stats, setStats] = useState({
    usersCount: 0,
    moviesCount: 0,
    watchlistCount: 0,
    progressCount: 0,
  });
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [activeTab, setActiveTab] = useState('movies'); // 'movies' | 'users'
  const [loading, setLoading] = useState(true);

  // Add/Edit movie modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    poster: '',
    backdrop: '',
    videoUrl: '',
    rating: 8.5,
    releaseYear: 2025,
    duration: '2h 15m',
    genres: 'Sci-Fi, Action',
    matchScore: 98,
  });
  const [savingMovie, setSavingMovie] = useState(false);

  // Load stats, movies, and users
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, moviesRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getMovies(),
        adminService.getUsers(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats || {});
      }
      if (moviesRes.success && Array.isArray(moviesRes.movies)) {
        setMovies(moviesRes.movies);
      }
      if (usersRes.success && Array.isArray(usersRes.users)) {
        setUsers(usersRes.users);
      }
    } catch (err) {
      console.warn('Admin load error:', err.message);
      toast.error('Failed to load some admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const openAddModal = () => {
    setEditingMovieId(null);
    setFormData({
      title: '',
      overview: '',
      poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
      videoUrl: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
      rating: 8.8,
      releaseYear: 2025,
      duration: '2h 10m',
      genres: 'Sci-Fi, Action',
      matchScore: 96,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (movie) => {
    setEditingMovieId(movie._id || movie.id);
    setFormData({
      title: movie.title || '',
      overview: movie.overview || '',
      poster: movie.poster || '',
      backdrop: movie.backdrop || '',
      videoUrl: movie.videoUrl || '',
      rating: movie.rating || 8.5,
      releaseYear: movie.releaseYear || 2025,
      duration: movie.duration || '2h 15m',
      genres: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || '',
      matchScore: movie.matchScore || 95,
    });
    setIsModalOpen(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Movie title is required');
      return;
    }

    setSavingMovie(true);
    try {
      const payload = {
        ...formData,
        genres: formData.genres
          .split(',')
          .map((g) => g.trim())
          .filter(Boolean),
        rating: Number(formData.rating),
        matchScore: Number(formData.matchScore),
      };

      if (editingMovieId) {
        const res = await adminService.updateMovie(editingMovieId, payload);
        if (res.success) {
          toast.success(`Updated "${payload.title}"`);
          setIsModalOpen(false);
          loadDashboardData();
        } else {
          toast.error(res.message || 'Update failed');
        }
      } else {
        const res = await adminService.addMovie(payload);
        if (res.success) {
          toast.success(`Created movie "${payload.title}"`);
          setIsModalOpen(false);
          loadDashboardData();
        } else {
          toast.error(res.message || 'Creation failed');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setSavingMovie(false);
    }
  };

  const handleDeleteMovie = async (movie) => {
    const id = movie._id || movie.id;
    if (!window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      return;
    }

    try {
      const res = await adminService.deleteMovie(id);
      if (res.success) {
        toast.info(`Deleted "${movie.title}"`);
        setMovies((prev) => prev.filter((m) => (m._id || m.id) !== id));
      } else {
        toast.error(res.message || 'Delete failed');
      }
    } catch (err) {
      toast.error('Failed to delete movie');
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0b0e] text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 overflow-hidden shadow-2xl bg-gradient-to-r from-red-950/30 via-[#121422]/90 to-black">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Control Center</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Platform Analytics & Content
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                Manage live catalog titles, inspect user profiles, and review streaming metrics.
              </p>
            </div>

            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
          </div>
        </div>

        {/* Analytics KPI Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Registered Users</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats.usersCount ?? users.length}
            </div>
            <p className="text-[11px] text-gray-500">Platform accounts</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Catalog Titles</span>
              <Film className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats.moviesCount ?? movies.length}
            </div>
            <p className="text-[11px] text-gray-500">Active streaming items</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Watchlists</span>
              <Bookmark className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats.watchlistCount ?? 0}
            </div>
            <p className="text-[11px] text-gray-500">Saved user bookmarks</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Streaming Sessions</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {stats.progressCount ?? 0}
            </div>
            <p className="text-[11px] text-gray-500">Progress timestamps logged</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'movies'
                  ? 'bg-red-600 text-white glow-red shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Movie Catalog ({movies.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-red-600 text-white glow-red shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Users Directory ({users.length})
            </button>
          </div>

          {activeTab === 'movies' && (
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 glow-red transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Movie</span>
            </button>
          )}
        </div>

        {/* TAB 1: MOVIES CATALOG TABLE */}
        {activeTab === 'movies' && (
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#12141c]/90 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 text-gray-400 uppercase tracking-wider text-[10px] border-b border-white/5">
                  <tr>
                    <th className="px-5 py-3.5">Movie</th>
                    <th className="px-4 py-3.5">Genres</th>
                    <th className="px-4 py-3.5">Rating</th>
                    <th className="px-4 py-3.5">Year</th>
                    <th className="px-4 py-3.5">Duration</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {movies.length > 0 ? (
                    movies.map((movie) => (
                      <tr key={movie._id || movie.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={movie.poster || movie.backdrop}
                              alt={movie.title}
                              className="w-10 h-14 object-cover rounded-lg bg-gray-900 border border-white/10 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white text-sm">{movie.title}</p>
                              <p className="text-[11px] text-gray-400 max-w-xs truncate">
                                {movie.overview}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-gray-300">
                            {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-amber-400">★ {movie.rating}</span>
                        </td>
                        <td className="px-4 py-3">{movie.releaseYear}</td>
                        <td className="px-4 py-3">{movie.duration}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(movie)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit Movie"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie)}
                              className="p-1.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete Movie"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                        No custom movies stored yet. Click "Add New Movie" above to add titles to MongoDB!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USERS DIRECTORY TABLE */}
        {activeTab === 'users' && (
          <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden bg-[#12141c]/90 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/50 text-gray-400 uppercase tracking-wider text-[10px] border-b border-white/5">
                  <tr>
                    <th className="px-5 py-3.5">User</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 font-semibold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white">
                          {u.name ? u.name[0].toUpperCase() : 'U'}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-white/5 text-gray-300 border border-white/10'
                          }`}
                        >
                          {u.role || 'member'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ADD / EDIT MOVIE MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#12141c] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-red-500" />
                  <span>{editingMovieId ? 'Edit Catalog Movie' : 'Add New Movie to Catalog'}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 uppercase tracking-wider">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    placeholder="e.g. Cyberpulse: Omega"
                  />
                </div>

                {/* Overview */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 uppercase tracking-wider">
                    Synopsis / Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none resize-none"
                    placeholder="Plot summary..."
                  />
                </div>

                {/* Poster & Backdrop URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300 uppercase tracking-wider">
                      Poster Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.poster}
                      onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300 uppercase tracking-wider">
                      Backdrop Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.backdrop}
                      onChange={(e) => setFormData({ ...formData, backdrop: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Video Stream URL */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 uppercase tracking-wider">
                    Video Stream URL (MP4 / WebM)
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    placeholder="https://...mp4"
                  />
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300 uppercase tracking-wider">
                      Rating (0-10)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300 uppercase tracking-wider">
                      Release Year
                    </label>
                    <input
                      type="number"
                      value={formData.releaseYear}
                      onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300 uppercase tracking-wider">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-gray-300 uppercase tracking-wider">
                      Match Score %
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={formData.matchScore}
                      onChange={(e) => setFormData({ ...formData, matchScore: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Genres */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-300 uppercase tracking-wider">
                    Genres (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.genres}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-red-500 focus:outline-none"
                    placeholder="Sci-Fi, Action, Thriller"
                  />
                </div>

                {/* Modal Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingMovie}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 glow-red transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingMovie ? 'Saving...' : 'Save Movie'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
