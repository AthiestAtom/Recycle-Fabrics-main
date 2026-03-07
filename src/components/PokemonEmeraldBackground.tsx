import React from 'react';

const PokemonEmeraldBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Animated Pokemon Emerald style background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-teal-700 to-cyan-600">
        {/* Grid pattern like Pokemon games */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating Pokemon elements */}
        <div className="absolute top-10 left-10 text-6xl animate-bounce opacity-30">🌿</div>
        <div className="absolute top-32 right-20 text-5xl animate-pulse opacity-25">🌊</div>
        <div className="absolute bottom-20 left-32 text-6xl animate-bounce delay-1000 opacity-30">🌴</div>
        <div className="absolute bottom-40 right-16 text-5xl animate-pulse delay-2000 opacity-25">🗿</div>
        <div className="absolute top-1/2 left-20 text-4xl animate-spin opacity-20">⭐</div>
        <div className="absolute top-1/3 right-32 text-4xl animate-spin opacity-20">💎</div>
        
        {/* Water effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-cyan-900/20" />
        
        {/* Scanlines effect for retro feel */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
            animation: 'scanlines 8s linear infinite'
          }} />
        </div>
      </div>
      
      {/* Pokemon Emerald style UI elements */}
      <div className="absolute top-4 left-4 bg-emerald-600/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg">
        <div className="text-white font-bold text-sm">POKÉMON EMERALD</div>
        <div className="text-emerald-100 text-xs">TEXTILE RECYCLING EDITION</div>
      </div>
      
      <div className="absolute top-4 right-4 bg-emerald-600/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg">
        <div className="text-white font-bold text-sm">CHANDIGARH REGION</div>
        <div className="text-emerald-100 text-xs">SECTORS: 1-56</div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-emerald-600/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg">
        <div className="text-white font-bold text-sm">⏱️ TIME: 12:34</div>
        <div className="text-emerald-100 text-xs">📍 SECTOR 17</div>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-emerald-600/80 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-emerald-400 shadow-lg">
        <div className="text-white font-bold text-sm">🎮 START MENU</div>
        <div className="text-emerald-100 text-xs">PRESS A TO CONTINUE</div>
      </div>
    </div>
  );
};

export default PokemonEmeraldBackground;
