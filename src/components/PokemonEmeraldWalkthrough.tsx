import React, { useState, useEffect } from 'react';

const PokemonEmeraldWalkthrough = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const walkthroughSteps = [
    {
      title: "🌿 Welcome to Hoenn Region!",
      text: "Your textile recycling adventure begins in Chandigarh!",
      location: "SECTOR 17",
      action: "Press START to begin your journey"
    },
    {
      title: "🎯 Meet Professor Oak",
      text: "I'm Professor Oak! I study fabric recycling patterns.",
      location: "RESEARCH LAB",
      action: "Choose your starter fabric type"
    },
    {
      title: "👕 Choose Your Fabric!",
      text: "COTTON, DENIM, or POLYESTER - Which will you choose?",
      location: "LABORATORY",
      action: "Each has unique recycling properties"
    },
    {
      title: "🗺️ Explore Chandigarh Sectors",
      text: "Visit different sectors to collect fabrics!",
      location: "SECTOR 22",
      action: "Use your POKEDEX to identify materials"
    },
    {
      title: "⚔️ Battle Fabric Waste!",
      text: "Use AI Vision to defeat textile pollution!",
      location: "SECTOR 35",
      action: "Scan and classify for XP points"
    },
    {
      title: "🏆 Earn Recycling Badges!",
      text: "Collect badges from each sector for successful recycling!",
      location: "SECTOR 43",
      action: "Become a Fabric Recycling Champion"
    },
    {
      title: "🌊 Water Type Fabrics",
      text: "Found SILK and LINEN! These need special care.",
      location: "SECTOR 15",
      action: "Use gentle washing techniques"
    },
    {
      title: "🔥 Fire Type Fabrics",
      text: "Discovered WOOL and LEATHER! High durability materials!",
      location: "SECTOR 19",
      action: "Perfect for winter recycling"
    },
    {
      title: "⚡ Electric Type Processing",
      text: "NYLON and POLYESTER detected! Synthetic materials!",
      location: "SECTOR 27",
      action: "Special chemical recycling required"
    },
    {
      title: "🌟 Champion Battle!",
      text: "Face the Textile Waste Champion!",
      location: "SECTOR 8",
      action: "Use all your knowledge to win!"
    },
    {
      title: "🏅 Hall of Fame!",
      text: "Congratulations! You're a Fabric Recycling Master!",
      location: "CHAMPION HALL",
      action: "Your journey continues..."
    },
    {
      title: "🔄 New Game+",
      text: "Start again with advanced recycling knowledge!",
      location: "MAIN MENU",
      action: "Save your progress and continue"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % walkthroughSteps.length);
    }, 5000); // Change step every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, walkthroughSteps.length]);

  const currentWalkthrough = walkthroughSteps[currentStep];

  return (
    <div className="fixed bottom-8 right-8 w-96 bg-emerald-900/95 backdrop-blur-md border-4 border-emerald-400 rounded-2xl shadow-2xl p-4 z-50 transform transition-all duration-500 hover:scale-105">
      {/* Pokemon Emerald style header */}
      <div className="bg-emerald-600 -m-4 mb-4 p-3 rounded-t-xl border-b-4 border-emerald-400">
        <div className="flex items-center justify-between">
          <div className="text-white font-bold retro-text">⭐ POKÉDEX ⭐</div>
          <div className="text-emerald-100 text-sm retro-text">STEP {currentStep + 1}/{walkthroughSteps.length}</div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="space-y-3">
        <div className="text-center">
          <div className="text-2xl mb-2">🎮</div>
          <h3 className="text-emerald-300 font-bold text-lg retro-text">
            {currentWalkthrough.title}
          </h3>
        </div>
        
        <div className="bg-emerald-800/50 rounded-lg p-3 border-2 border-emerald-600">
          <p className="text-emerald-100 text-sm retro-text leading-relaxed">
            {currentWalkthrough.text}
          </p>
        </div>
        
        <div className="flex items-center justify-between bg-emerald-800/30 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">📍</span>
            <span className="text-emerald-200 text-sm font-bold retro-text">
              {currentWalkthrough.location}
            </span>
          </div>
        </div>
        
        <div className="bg-emerald-700/50 rounded-lg p-2 border-2 border-emerald-500">
          <p className="text-emerald-100 text-xs retro-text text-center">
            {currentWalkthrough.action}
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="bg-emerald-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / walkthroughSteps.length) * 100}%` }}
          />
        </div>
        
        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 pokemon-button px-3 py-2 text-xs"
          >
            {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
          </button>
          <button
            onClick={() => setCurrentStep((prev) => (prev - 1 + walkthroughSteps.length) % walkthroughSteps.length)}
            className="pokemon-button px-3 py-2 text-xs"
          >
            ⬅️ PREV
          </button>
          <button
            onClick={() => setCurrentStep((prev) => (prev + 1) % walkthroughSteps.length)}
            className="pokemon-button px-3 py-2 text-xs"
          >
            NEXT ➡️
          </button>
        </div>
      </div>
      
      {/* Animated corner decoration */}
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rotate-45 transform" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-400 rotate-45 transform" />
    </div>
  );
};

export default PokemonEmeraldWalkthrough;
