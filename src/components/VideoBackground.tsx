import React, { useState, useEffect, useRef } from 'react';

const VideoBackground = () => {
  const [isLoaded, setIsLoaded] = useState(true); // Start as loaded
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>('Video disabled for performance'); // Start with error
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Video is disabled for performance - 1.13GB file is too large
    return;
  }, []);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(err => {
        setError('Failed to play video');
      });
      setIsPlaying(true);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 -z-50 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-4">🎮</div>
            <p className="text-xl">Video unavailable</p>
            <p className="text-sm opacity-75">Using gradient background</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 -z-50">
      {/* Video Background - Full Screen */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="fixed inset-0 w-full h-full object-cover"
        style={{
          filter: 'blur(1px) brightness(0.7)',
          transform: 'scale(1.05)',
          opacity: isLoaded ? 0.8 : 0,
          transition: 'opacity 2s ease-in-out',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1
        }}
      >
        <source src="/videoplayback.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Minimal overlay for better text readability */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-emerald-900/10 via-teal-800/10 to-cyan-900/10"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1
        }}
      />
      
      {/* Scanlines effect for retro gaming feel */}
      <div 
        className="fixed inset-0 opacity-8"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          animation: 'scanlines 8s linear infinite'
        }}
      />

      {/* Loading indicator */}
      {!isLoaded && !error && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400">
          <div className="text-white text-center">
            <div className="text-6xl mb-4 animate-bounce">🎮</div>
            <p className="text-xl font-bold">
              {loadingTimeout ? 'Video is large, loading...' : 'Loading Pokemon Emerald...'}
            </p>
            <p className="text-sm opacity-75">
              {loadingTimeout ? 'This may take a moment on slow connections' : 'Please wait'}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-1000"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-2000"></div>
            </div>
            {loadingTimeout && (
              <button
                onClick={() => {
                  setError('Video skipped - using gradient background');
                }}
                className="mt-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition-colors"
              >
                Skip Video →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={togglePlayPause}
          className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-black/70 transition-colors duration-200 flex items-center gap-2"
        >
          {isPlaying ? '⏸️' : '▶️'}
          <span className="text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      </div>

      {/* Pokemon Emerald Style UI Elements */}
      <div className="fixed top-4 left-4 bg-emerald-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg z-40">
        <div className="text-white font-bold text-sm">POKÉMON EMERALD</div>
        <div className="text-emerald-200 text-xs">TEXTILE RECYCLING EDITION</div>
      </div>
      
      <div className="fixed top-4 right-4 bg-emerald-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg z-40">
        <div className="text-white font-bold text-sm">CHANDIGARH REGION</div>
        <div className="text-emerald-200 text-xs">SECTORS: 1-56</div>
      </div>
      
      <div className="fixed bottom-4 left-4 bg-emerald-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg z-40">
        <div className="text-white font-bold text-sm">⏱️ TIME: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="text-emerald-200 text-xs">📍 SECTOR 17</div>
      </div>

      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
        
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default VideoBackground;
