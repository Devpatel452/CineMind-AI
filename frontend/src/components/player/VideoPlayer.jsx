import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  Settings,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Sparkles,
} from 'lucide-react';

const VideoPlayer = ({
  movie,
  videoConfig,
  initialTime = 0,
  onProgressUpdate,
  onClose,
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasResumed, setHasResumed] = useState(false);

  const currentSource = usingFallback
    ? videoConfig?.fallbackUrl
    : videoConfig?.videoUrl;

  // Format seconds into MM:SS or HH:MM:SS
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const hrs = Math.floor(timeInSeconds / 3600);
    const mins = Math.floor((timeInSeconds % 3600) / 60);
    const secs = Math.floor(timeInSeconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Auto-hide controls after inactivity
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
      }
    }, 3500);
  }, [isPlaying]);

  // Initial resume from previous playback position
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);

      if (initialTime > 5 && !hasResumed && initialTime < video.duration - 10) {
        video.currentTime = initialTime;
        setHasResumed(true);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [initialTime, hasResumed]);

  // Periodic progress saving for Continue Watching feature
  useEffect(() => {
    if (!isPlaying || !onProgressUpdate) return;

    const interval = setInterval(() => {
      if (videoRef.current && duration > 0) {
        onProgressUpdate(videoRef.current.currentTime, duration);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, onProgressUpdate]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch((e) => setError(e.message));
    } else {
      video.pause();
      setIsPlaying(false);
      if (onProgressUpdate) onProgressUpdate(video.currentTime, video.duration);
    }
  }, [onProgressUpdate]);

  // Seek forward/backward
  const seekRelative = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekRelative(10);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setVolume((v) => {
          const next = Math.min(1, Math.round((v + 0.1) * 10) / 10);
          if (videoRef.current) {
            videoRef.current.volume = next;
            videoRef.current.muted = false;
          }
          setIsMuted(false);
          return next;
        });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setVolume((v) => {
          const next = Math.max(0, Math.round((v - 0.1) * 10) / 10);
          if (videoRef.current) {
            videoRef.current.volume = next;
            videoRef.current.muted = next === 0;
          }
          setIsMuted(next === 0);
          return next;
        });
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekRelative, toggleFullscreen, toggleMute]);

  // Progress timeline seek
  const handleTimelineChange = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  // Speed change
  const handleSpeedSelect = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  // Subtitles toggle
  const toggleSubtitles = () => {
    const video = videoRef.current;
    if (!video || !video.textTracks[0]) return;
    const track = video.textTracks[0];
    const newState = !subtitlesEnabled;
    track.mode = newState ? 'showing' : 'hidden';
    setSubtitlesEnabled(newState);
  };

  // Handle stream error & fallback
  const handleVideoError = () => {
    setIsLoading(false);
    if (!usingFallback && videoConfig?.fallbackUrl) {
      console.warn('[Video Player] Primary stream unreachable, attempting fallback stream...');
      setUsingFallback(true);
      setError(null);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    } else {
      setError('Playback stream is currently unavailable. Please verify connection or try another title.');
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-[500px] bg-black text-white select-none overflow-hidden flex flex-col justify-between group"
    >
      {/* Top Bar with Movie Title & Back Button */}
      <div
        className={`absolute top-0 inset-x-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-300 flex items-center justify-between ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md"
              title="Return to Details"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>{movie?.title || videoConfig?.title}</span>
              <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                Full Movie
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              {videoConfig?.license || 'Authorized Stream'} • 1080p Ultra HD
            </p>
          </div>
        </div>

        {initialTime > 5 && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resumed from {formatTime(initialTime)}</span>
          </div>
        )}
      </div>

      {/* HTML5 Video Element */}
      <div className="relative flex-1 flex items-center justify-center bg-black cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={currentSource}
          playsInline
          onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onError={handleVideoError}
          className="w-full h-full max-h-[92vh] object-contain"
        >
          {videoConfig?.subtitlesUrl && (
            <track
              kind="subtitles"
              src={videoConfig.subtitlesUrl}
              srcLang="en"
              label="English"
              default={subtitlesEnabled}
            />
          )}
        </video>

        {/* Loading Spinner Overlay */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 pointer-events-none z-20">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-3" />
            <p className="text-xs text-gray-300 font-medium tracking-wider">Buffering Stream...</p>
          </div>
        )}

        {/* Play / Pause Big Center Flash Overlay */}
        {!isPlaying && !isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20 pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl glow-red">
              <Play className="w-9 h-9 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Error Fallback Notice */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center z-30">
            <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Video Playback Error</h3>
            <p className="text-sm text-gray-400 max-w-md mb-6">{error}</p>
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Back to Details
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls Overlay */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent transition-opacity duration-300 space-y-3 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Timeline Seekbar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-300 font-mono w-12 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max="100"
            value={duration > 0 ? (currentTime / duration) * 100 : 0}
            onChange={handleTimelineChange}
            className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600 hover:h-2.5 transition-all"
          />

          <span className="text-xs text-gray-400 font-mono w-12">
            {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between">
          {/* Left Buttons: Play, Rewind, Forward, Volume */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
            </button>

            <button
              onClick={() => seekRelative(-10)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => seekRelative(10)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Forward 10 seconds"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 group/vol">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600 hidden sm:inline-block"
              />
            </div>
          </div>

          {/* Right Buttons: Subtitles, Speed, Quality, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Subtitles Toggle */}
            <button
              onClick={toggleSubtitles}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                subtitlesEnabled ? 'bg-red-600 text-white' : 'hover:bg-white/10 text-gray-300'
              }`}
              title="Toggle Subtitles"
            >
              <Subtitles className="w-5 h-5" />
            </button>

            {/* Playback Speed Menu */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-xs font-semibold text-gray-300 border border-white/10 cursor-pointer"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-12 right-0 bg-[#12141c]/95 border border-white/10 rounded-xl p-1.5 shadow-2xl backdrop-blur-xl flex flex-col gap-1 min-w-[80px]">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedSelect(s)}
                      className={`px-3 py-1 text-xs rounded-lg text-left ${
                        playbackSpeed === s ? 'bg-red-600 text-white font-bold' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
