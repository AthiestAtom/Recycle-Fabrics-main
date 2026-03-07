import React, { useState, useEffect, useRef } from 'react';

const VideoBackground = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [videoAttempted, setVideoAttempted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoAttempted(true);

    const handleCanPlay = () => {
      console.log('Video can play - success!');
      setIsLoaded(true);
      setIsPlaying(true);
      setError(null);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    const handleError = (e: Event) => {
      console.log('Video loading failed, but that\'s okay - using gradient');
      // Don't set error immediately - let timeout handle it gracefully
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      console.log('Video load started - being optimistic!');
      setIsLoaded(false);
      
      // Try to load video everywhere - no more GitHub Pages restrictions
      timeoutRef.current = setTimeout(() => {
        console.log('Video timeout, but gracefully switching to gradient');
        setError(null); // Clear any errors - just use gradient
        setLoadingTimeout(true);
      }, 20000); // 20 seconds - give it more time
    };

    const handleProgress = () => {
      if (video.readyState >= 1) {
        console.log('Video progress detected - looking good!');
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('progress', handleProgress);

    // Set video properties for optimization
    video.playbackRate = 8.0;
    video.volume = 0;

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('progress', handleProgress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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

  return (
    <div className="fixed inset-0 -z-50">
      {/* Video Background - Smart Loading */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto" // Force preload the video
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

      {/* Gradient background - Always present as safety net */}
      <div 
        className="fixed inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -2,
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 2s ease-in-out'
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

      {/* Video Loading Indicator */}
      {!isLoaded && videoAttempted && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400">
          <div className="text-white text-center">
            <div className="text-6xl mb-4 animate-bounce">🎮</div>
            <p className="text-xl font-bold">
              {loadingTimeout ? 'Loading your amazing video... 🎬' : 'Loading Pokemon Emerald Video...'}
            </p>
            <p className="text-sm opacity-75">
              {loadingTimeout 
                ? 'Your epic video background is worth the wait! �' 
                : 'Preparing your incredible video experience...'}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-1000"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-2000"></div>
            </div>
            {loadingTimeout && (
              <div className="mt-4 space-y-2">
                <p className="text-xs opacity-60">💡 Large video files take time but are absolutely worth it!</p>
                <button
                  onClick={() => {
                    setLoadingTimeout(false); // Just stop the loading indicator
                  }}
                  className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30 hover:bg-white/30 transition-colors text-sm"
                >
                  Continue Without Video
                </button>
              </div>
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
