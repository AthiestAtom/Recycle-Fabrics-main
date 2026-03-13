import { Loader2, Camera, Sparkles, Search, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

const AnalyzingState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Camera, text: "Capturing image details" },
    { icon: Search, text: "Analyzing fabric patterns" },
    { icon: Sparkles, text: "AI material identification" },
    { icon: CheckCircle, text: "Generating recycling guidance" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = steps[currentStep].icon;

  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-emerald-200 animate-pulse" />
        <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-100 to-blue-100 opacity-30 animate-ping" />
      </div>
      
      <div className="text-center max-w-md">
        <p className="font-display text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Analyzing your fabric...
        </p>
        <p className="text-gray-600 font-medium mb-4">Our AI is working its magic</p>
        
        <div className="flex items-center justify-center gap-3 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-100 to-blue-100 flex items-center justify-center">
            <CurrentIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-gray-700 font-medium">{steps[currentStep].text}</p>
        </div>
        
        <div className="flex gap-2 mt-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? "bg-emerald-500 w-8" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyzingState;
