import Router from 'preact-router';
import { lazy, Suspense, useState, useEffect } from 'preact/compat';
import { PhotoProvider } from '../hooks/usePhotos';
import { Header } from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginForm } from '../components/LoginForm';
import { apiClient } from '../apiClient';

const Gallery = lazy(() => import('./Gallery'));
const Detail = lazy(() => import('./Detail'));
const Settings = lazy(() => import('./Settings'));
const Slideshow = lazy(() => import('./Slideshow'));

export const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        await apiClient.getCurrentUser();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    apiClient.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <PhotoProvider>
      <div class="min-h-screen bg-gray-900 text-gray-100">
        <Header onLogout={handleLogout} />
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
};
