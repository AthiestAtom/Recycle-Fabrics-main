import { useCallback, useState } from "react";
import { Upload, Camera, X, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClear: () => void;
  isAnalyzing: boolean;
  modelLoading: boolean; // Add model loading prop
}

const ImageUploader = ({ onImageSelect, selectedImage, onClear, isAnalyzing }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (selectedImage) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-200 shadow-xl bg-gradient-to-br from-emerald-50 to-blue-50">
        <img src={selectedImage} alt="Selected fabric" className="w-full max-h-[400px] object-contain" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          {modelLoading ? (
            <>
              <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin" />
              <p className="text-white text-sm">Loading AI model...</p>
            </>
          ) : (
            <>
              {!isAnalyzing && (
                <button
                  onClick={onClear}
                  type="button"
                  aria-label="Clear selected image"
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="flex items-center gap-2 text-white">
            <Camera className="w-5 h-5" />
            <span className="font-medium">Fabric photo ready for analysis</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer
        ${isDragging 
          ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-blue-50 scale-[1.02] shadow-xl" 
          : "border-gray-300 hover:border-emerald-400 hover:bg-gradient-to-br hover:from-emerald-25 hover:to-blue-25 bg-white shadow-lg hover:shadow-xl"
        }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
        id="fabric-upload"
        aria-label="Upload fabric image for classification"
        name="fabric-image"
      />
      <div className="flex flex-col items-center gap-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDragging 
            ? "bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg scale-110" 
            : "bg-gradient-to-r from-emerald-100 to-blue-100"
        }`}>
          <Upload 
            aria-label="Upload fabric image"
            className={`w-10 h-10 transition-colors duration-300 ${
              isDragging ? "text-white" : "text-emerald-600"
            }`} 
          />
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-gray-800 mb-2">
            {isDragging ? "Drop your fabric photo" : "Upload your fabric photo"}
          </p>
          <p className="text-gray-600 font-medium">
            or click to browse · JPG, PNG, WebP up to 10MB
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <Button variant="outline" size="lg" className="gap-3 px-6 py-3 rounded-xl border-2 hover:bg-gray-50 transition-all duration-300" asChild>
            <label htmlFor="fabric-upload" className="cursor-pointer">
              <ImageIcon className="w-5 h-5" />
              Browse Files
            </label>
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>AI will analyze the material type and recycling options</span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
