import { useRef, useState } from 'preact/hooks';
import { usePhotos } from '../hooks/usePhotos';

const USER_ID = import.meta.env.VITE_USER_ID ?? 'demo-user';

export const UploadSection = () => {
  const { refresh } = usePhotos();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  const upload = async () => {
    const files = inputRef.current?.files;
    if (!files?.length) return;
    const formData = new FormData();
    Array.from(files).forEach((file: File) => formData.append('files', file));
    formData.append('user_id', USER_ID);
    setLoading(true);
    setMessage(undefined);
    try {
      const res = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      setMessage('Upload queued. Processing: EXIF → Geocode → Caption.');
      inputRef.current!.value = '';
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const importFromGoogle = async () => {
    setImporting(true);
    setMessage(undefined);
    setMessage('Connecting to Google Photos… signed import requires OAuth.');
    setTimeout(() => {
      setImporting(false);
      setMessage('Import ready once OAuth credentials are configured.');
    }, 1200);
  };

  return (
    <section class="rounded-lg border border-dashed border-gray-600 bg-gray-900/50 p-4 text-sm">
      <h2 class="text-lg font-semibold text-white">Upload Photos</h2>
      <p class="mt-1 text-gray-400">Images stay private and are processed asynchronously.</p>
      <div class="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
        <input ref={inputRef} type="file" accept="image/*" multiple class="text-gray-300" aria-label="Upload photos" />
        <button
          class="rounded bg-accent px-4 py-2 text-sm font-semibold text-gray-900 disabled:opacity-50"
          onClick={upload}
          disabled={loading}
          data-testid="btn-upload"
        >
          {loading ? 'Uploading…' : 'Upload'}
        </button>
        <button
          class="rounded border border-accent px-4 py-2 text-sm font-semibold text-accent disabled:opacity-50"
          onClick={importFromGoogle}
          disabled={importing}
          data-testid="btn-import-google"
        >
          {importing ? 'Preparing import…' : 'Import from Google Photos'}
        </button>
      </div>
      {loading ? (
        <div class="mt-3" aria-live="polite">
          <div
            class="h-2 w-full overflow-hidden rounded bg-gray-800"
            role="progressbar"
            aria-valuetext="Uploading photo"
            data-testid="progress-bar"
          >
            <div class="h-full w-2/3 animate-pulse bg-accent/70" />
          </div>
          <p class="mt-2 text-xs text-gray-400">Processing steps: EXIF → Geocode → Caption</p>
        </div>
      ) : null}
      {message ? <p class="mt-2 text-xs text-gray-300">{message}</p> : null}
    </section>
  );
};
