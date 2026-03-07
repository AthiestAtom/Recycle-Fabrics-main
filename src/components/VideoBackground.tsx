import React, { useState, useEffect, useRef } from 'react';

const VideoBackground = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // YouTube iframe loads pretty quickly
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000); // Give YouTube 2 seconds to load
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 -z-50">
      {/* YouTube Video Background */}
      <iframe
        ref={videoRef}
        src="https://www.youtube.com/embed/owRVh3-eZxM?autoplay=1&mute=1&loop=1&playlist=owRVh3-eZxM&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: '100vw',
          height: '56.25vw', // 16:9 aspect ratio
          minWidth: '177.77vh',
          minHeight: '100vh',
          transform: 'translate(-50%, -50%) scale(1.1)',
          filter: 'blur(1px) brightness(0.7)',
          opacity: isLoaded ? 0.8 : 0,
          transition: 'opacity 2s ease-in-out',
          pointerEvents: 'none',
          zIndex: -1
        }}
        frameBorder="0"
        allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

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
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <button
          onClick={togglePlayPause}
          className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20 hover:bg-black/70 transition-colors duration-200 flex items-center gap-2"
        >
          {isPlaying ? '⏸️' : '▶️'}
          <span className="text-sm">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
        
        {/* Test button for debugging */}
        <button
          onClick={() => {
            const video = videoRef.current;
            if (video) {
              console.log('Video element:', video);
              console.log('Video src:', video.src);
              console.log('Video readyState:', video.readyState);
              console.log('Video paused:', video.paused);
              console.log('Video currentTime:', video.currentTime);
              console.log('Video duration:', video.duration);
              
              // Try direct play
              video.play().then(() => {
                console.log('Direct play successful');
                setIsPlaying(true);
              }).catch(err => {
                console.log('Direct play failed:', err);
                // Try loading first
                video.load();
                setTimeout(() => {
                  video.play().then(() => {
                    console.log('Play after load successful');
                    setIsPlaying(true);
                  }).catch(err2 => {
                    console.log('Play after load failed:', err2);
                  });
                }, 2000);
              });
            } else {
              console.log('No video element found');
            }
          }}
          className="bg-red-500/80 backdrop-blur-sm text-white px-3 py-1 rounded text-xs"
        >
          Test Video
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
