import { RouteComponentProps } from 'preact-router';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { usePhotos } from '../hooks/usePhotos';

const Slideshow = (_props: RouteComponentProps) => {
  const { photos, settings } = usePhotos();
  const readyPhotos = useMemo(() => photos.filter((photo) => photo.status === 'ready'), [photos]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [readyPhotos.length]);

  const intervalMs = (settings?.slideshowIntervalSec ?? 5) * 1000;

  const next = useCallback(() => {
    setIndex((prev) => (readyPhotos.length ? (prev + 1) % readyPhotos.length : 0));
  }, [readyPhotos.length]);

  const prev = useCallback(() => {
    setIndex((prev) => (readyPhotos.length ? (prev - 1 + readyPhotos.length) % readyPhotos.length : 0));
  }, [readyPhotos.length]);

  useEffect(() => {
    if (!readyPhotos.length) return;
    const timer = window.setInterval(next, intervalMs);
    return () => window.clearInterval(timer);
  }, [readyPhotos.length, intervalMs, next]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
      }
      if (event.key === 'Enter' && settings?.detailOnly && readyPhotos[index]) {
        window.location.href = `/photos/${readyPhotos[index].id}`;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev, readyPhotos, index, settings]);

  if (!readyPhotos.length) {
    return <p class="text-center text-gray-400">No ready photos yet.</p>;
  }

  const current = readyPhotos[index];

  return (
    <section class="flex flex-1 flex-col items-center justify-center gap-4">
      <figure class="w-full max-w-4xl">
        <img
          src={`/media/${current.id}/2048`}
          srcset={`/media/${current.id}/1024 1024w, /media/${current.id}/2048 2048w`}
          sizes="100vw"
          class="mx-auto max-h-[80vh] w-full rounded object-contain"
          alt={current.captionAi ?? 'Slideshow photo'}
        />
      </figure>
      <div class="flex flex-col items-center gap-2 text-center">
        <h2 class="text-xl font-semibold text-white">{current.captionAi ?? 'Caption pending…'}</h2>
        <p class="text-sm text-gray-300">{current.placeDisplay?.label ?? 'Location unavailable'}</p>
        <div class="flex items-center gap-4 text-xs text-gray-400">
          <button class="rounded bg-gray-700 px-3 py-1" onClick={prev}>
            Prev
          </button>
          <span>
            {index + 1} / {readyPhotos.length}
          </span>
          <button class="rounded bg-gray-700 px-3 py-1" onClick={next}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Slideshow;
