import { Recycle, Leaf, AlertTriangle, CheckCircle2, Info, Sparkles, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export interface FabricResult {
  material: string;
  confidence: number;
  recyclable: boolean;
  biodegradable: boolean;
  guidance: string;
  tips: string[];
  environmental_impact: string;
}

interface ClassificationResultProps {
  result: FabricResult;
}

const ClassificationResult = ({ result }: ClassificationResultProps) => {
  const confidenceColor = result.confidence >= 80 ? "text-emerald-600" : result.confidence >= 50 ? "text-blue-600" : "text-orange-600";
  const confidenceBgColor = result.confidence >= 80 ? "bg-emerald-100" : result.confidence >= 50 ? "bg-blue-100" : "bg-orange-100";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Main Result Card */}
      <Card className="p-8 bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-0 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Identified Material</p>
                <h3 className="font-display text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">{result.material}</h3>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {result.recyclable && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 gap-2 px-3 py-2 rounded-xl">
                <Recycle className="w-4 h-4" /> Recyclable
              </Badge>
            )}
            {result.biodegradable && (
              <Badge className="bg-green-100 text-green-700 border-green-200 gap-2 px-3 py-2 rounded-xl">
                <Leaf className="w-4 h-4" /> Biodegradable
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">AI Confidence</span>
            <span className={`font-bold text-lg ${confidenceColor}`}>{result.confidence}%</span>
          </div>
          <div className="relative">
            <Progress value={result.confidence} className="h-3" />
            <div className={`absolute top-0 left-0 h-full rounded-full ${confidenceBgColor} opacity-30`} style={{width: `${result.confidence}%`}} />
          </div>
        </div>
      </Card>

      {/* Recycling Guidance */}
      <Card className="p-6 bg-white border-0 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
            <Recycle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-display text-xl font-bold text-gray-800 mb-3">Recycling Guidance</h4>
            <p className="text-gray-600 leading-relaxed">{result.guidance}</p>
          </div>
        </div>
      </Card>

      {/* Action Tips */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-display text-xl font-bold text-gray-800 mb-4">What You Can Do</h4>
            <div className="space-y-3">
              {result.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Environmental Impact */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-0 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-display text-xl font-bold text-gray-800 mb-3">Environmental Impact</h4>
            <p className="text-gray-600 leading-relaxed">{result.environmental_impact}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClassificationResult;
