import { cn } from "@/utils/lib/utils";

const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 border-t-transparent"></div>
      <p className="ml-3 text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
