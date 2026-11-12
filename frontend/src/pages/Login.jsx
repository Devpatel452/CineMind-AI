import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setFormError(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-rose-950/20 blur-[100px] rounded-full" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl glass-panel p-8 sm:p-10 border border-white/10 shadow-2xl backdrop-blur-2xl">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center glow-red transition-transform group-hover:scale-105 shadow-lg">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              CINE<span className="text-red-600">MIND</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-gray-400">
            Sign in to unlock personalized AI movie recommendations
          </p>
        </div>

        {/* Error Notification */}
        {formError && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{formError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#0a0b0e]/80 border border-gray-800 rounded-xl px-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-300">Password</label>
              <span className="text-[11px] text-gray-500 hover:text-red-400 cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#0a0b0e]/80 border border-gray-800 rounded-xl px-10 pr-10 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300 cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-800/60 text-white font-bold text-sm flex items-center justify-center gap-2 glow-red transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg mt-2"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Switcher */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-gray-400">
          <span>New to CineMind AI? </span>
          <Link
            to="/signup"
            state={location.state}
            className="text-red-400 hover:text-red-300 font-semibold transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
