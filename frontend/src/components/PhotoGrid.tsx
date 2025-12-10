import { Link } from 'preact-router/match';
import { PhotoMetadata } from '../types';

const statusStyles: Record<string, string> = {
  processing: 'bg-yellow-500/20 text-yellow-200',
  error: 'bg-red-500/20 text-red-200',
  ready: 'bg-emerald-500/20 text-emerald-200'
};

export const PhotoGrid = ({ photos }: { photos: PhotoMetadata[] }) => (
  <section
    aria-label="Photo gallery"
    class="grid flex-1 grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5"
    data-testid="gallery-grid"
  >
    {photos.map((photo) => {
      const badgeClass = statusStyles[photo.status] ?? 'bg-gray-600/60 text-gray-200';
      return (
        // @ts-ignore
        <Link
          key={photo.id}
          href={`/photos/${photo.id}`}
          class="group relative block overflow-hidden rounded-lg bg-gray-800"
          data-testid="photo-thumb"
        >
          <div class="aspect-square bg-gray-900">
            <img
              loading="lazy"
              src={`/media/${photo.id}/256`}
              srcset={`/media/${photo.id}/256 256w, /media/${photo.id}/1024 1024w`}
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 45vw"
              alt={photo.captionAi ?? 'Photo thumbnail'}
              class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <div class="absolute left-2 top-2 rounded px-2 py-1 text-xs font-medium uppercase tracking-wide text-white">
            <span class={`rounded px-1 py-0.5 ${badgeClass}`}>{photo.status}</span>
          </div>
          {photo.placeDisplay?.label ? (
            <span class="absolute bottom-2 left-2 rounded bg-black/60 px-2 py-1 text-[11px] uppercase tracking-wide text-gray-100">
              {photo.placeDisplay.label}
            </span>
          ) : null}
        </Link>
      );
    })}
  </section>
);
