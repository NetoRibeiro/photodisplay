import Router from 'preact-router';
import { lazy, Suspense } from 'preact/compat';
import { PhotoProvider } from '../hooks/usePhotos';
import { Header } from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';

const Gallery = lazy(() => import('./Gallery'));
const Detail = lazy(() => import('./Detail'));
const Settings = lazy(() => import('./Settings'));
const Slideshow = lazy(() => import('./Slideshow'));

export const App = () => (
  <PhotoProvider>
    <div class="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-4">
        <Suspense fallback={<LoadingScreen message="Loading views" />}>
          <Router>
            <Gallery path="/" />
            <Detail path="/photos/:id" />
            <Settings path="/settings" />
            <Slideshow path="/slideshow" />
          </Router>
        </Suspense>
      </main>
    </div>
  </PhotoProvider>
);
