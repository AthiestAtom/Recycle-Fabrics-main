import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const Index = lazy(() => import('../pages/Index'));
const NotFound = lazy(() => import('../pages/NotFound'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Suspense fallback={<div className='flex items-center justify-center min-h-screen'>Loading...</div>}>
            <Routes>
              <Route path='/' element={<Index />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
