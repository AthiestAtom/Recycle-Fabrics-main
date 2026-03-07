import React, { useState, useEffect, useRef } from 'react';

const VideoBackground = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [speedBoost, setSpeedBoost] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // YouTube iframe loads pretty quickly
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleSpeed = () => {
    setSpeedBoost(!speedBoost);
  };

  return (
    <div className="fixed inset-0 -z-50">
      {/* YouTube Video Background */}
      <iframe
        ref={iframeRef}
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
          zIndex: -1,
          animation: speedBoost ? 'speedBoost 0.5s infinite' : 'none'
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

      {/* Loading indicator for YouTube video */}
      {!isLoaded && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-400" style={{ zIndex: 30 }}>
          <div className="text-white text-center">
            <div className="text-6xl mb-4 animate-bounce">🎮</div>
            <p className="text-xl font-bold">Loading YouTube Video...</p>
            <p className="text-sm opacity-75">Your epic background is starting...</p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-1000"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-2000"></div>
            </div>
          </div>
        </div>
      )}

      {/* Pokemon Emerald Style UI Elements */}
      <div className="fixed top-4 left-4 bg-emerald-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg z-40" style={{ zIndex: 50 }}>
        <div className="text-white font-bold text-sm">POKÉMON EMERALD</div>
        <div className="text-emerald-200 text-xs">TEXTILE RECYCLING EDITION</div>
      </div>
      
      <div className="fixed top-4 right-4 bg-emerald-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg z-40" style={{ zIndex: 50 }}>
        <div className="text-white font-bold text-sm">CHANDIGARH REGION</div>
        <div className="text-emerald-200 text-xs">SECTORS: 1-56</div>
      </div>
      
      <div className="fixed bottom-4 left-4 bg-emerald-800/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg z-40" style={{ zIndex: 50 }}>
        <div className="text-white font-bold text-sm">⏱️ TIME: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="text-emerald-200 text-xs">📍 SECTOR 17</div>
      </div>

      {/* Speed Control Button */}
      <div className="fixed bottom-4 right-4 z-50" style={{ zIndex: 100 }}>
        <button
          onClick={toggleSpeed}
          className={`px-4 py-2 rounded-lg border transition-colors duration-200 flex items-center gap-2 ${
            speedBoost 
              ? 'bg-orange-600/80 backdrop-blur-sm text-white border-orange-400 hover:bg-orange-700/80' 
              : 'bg-blue-600/80 backdrop-blur-sm text-white border-blue-400 hover:bg-blue-700/80'
          }`}
        >
          ⚡
          <span className="text-sm">{speedBoost ? '2x Active' : '2x Speed'}</span>
        </button>
      </div>

      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
        
        @keyframes speedBoost {
          0% { filter: blur(1px) brightness(0.7) hue-rotate(0deg); }
          50% { filter: blur(0.8px) brightness(0.9) hue-rotate(10deg); }
          100% { filter: blur(1px) brightness(0.7) hue-rotate(0deg); }
        }
        
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default VideoBackground;
