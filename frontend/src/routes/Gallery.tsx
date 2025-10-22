import { RouteComponentProps } from 'preact-router';
import { useState } from 'preact/hooks';
import { Link } from 'preact-router/match';
import { usePhotos } from '../hooks/usePhotos';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingScreen } from '../components/LoadingScreen';
import { PhotoGrid } from '../components/PhotoGrid';
import { UploadSection } from '../components/UploadSection';

const Gallery = (_props: RouteComponentProps) => {
  const { photos, loading, error, refresh } = usePhotos();
  const [showHelp, setShowHelp] = useState(false);

  if (loading) {
    return <LoadingScreen message="Loading photos" />;
  }

  return (
    <div class="flex flex-1 flex-col gap-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div class="md:flex-1">
          <UploadSection />
        </div>
        <div class="flex items-center justify-end gap-3">
          <Link
            href="/slideshow"
            class="rounded bg-gray-800 px-4 py-2 text-sm font-semibold text-accent"
            data-testid="btn-slideshow"
          >
            Open Slideshow
          </Link>
          <button
            class="rounded border border-gray-600 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-300"
            onClick={() => setShowHelp((value) => !value)}
            type="button"
          >
            {showHelp ? 'Hide Help' : 'Remote Tips'}
          </button>
        </div>
      </div>
      {error ? <ErrorBanner message={error} onRetry={refresh} /> : null}
      {photos.length ? (
        <PhotoGrid photos={photos} />
      ) : (
        <p class="text-center text-gray-400">Upload your first photo to begin.</p>
      )}
      {showHelp ? (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          role="dialog"
          aria-modal="true"
          data-testid="help-overlay"
        >
          <div class="max-w-md rounded-lg bg-gray-900 p-6 text-sm text-gray-200 shadow-lg">
            <h2 class="text-lg font-semibold text-white">TV Remote Shortcuts</h2>
            <ul class="mt-3 list-disc space-y-2 pl-5 text-left">
              <li>Use arrow keys or remote d-pad to move between thumbnails.</li>
              <li>Press Enter to open Detail view or pause slideshow.</li>
              <li>While in slideshow, use Left/Right to navigate manually.</li>
            </ul>
            <button
              class="mt-4 rounded bg-accent px-4 py-2 text-sm font-semibold text-gray-900"
              onClick={() => setShowHelp(false)}
              type="button"
            >
              Got it
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Gallery;
