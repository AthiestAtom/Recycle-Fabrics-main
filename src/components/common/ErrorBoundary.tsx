import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md rounded-lg border border-red-200 bg-white p-6 text-center shadow-lg">
            <AlertTriangle className="mx-auto mb-4 h-10 w-10 text-red-600" />
            <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
            <p className="mt-2 text-sm text-slate-600">
              The app hit an unexpected error. Reload the page to start fresh.
            </p>
            <Button className="mt-5" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
