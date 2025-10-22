import { RouteComponentProps } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { apiClient } from '../apiClient';
import { LoadingScreen } from '../components/LoadingScreen';
import { PhotoMeta } from '../components/PhotoMeta';
import { usePhotos } from '../hooks/usePhotos';
import { PhotoMetadata } from '../types';

interface DetailProps extends RouteComponentProps<{ id?: string }> {}

const Detail = ({ id }: DetailProps) => {
  const { updatePhoto } = usePhotos();
  const [photo, setPhoto] = useState<PhotoMetadata>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(undefined);
    apiClient
      .getPhoto(id)
      .then((response) => {
        if (!mounted) return;
        setPhoto(response);
        updatePhoto(response);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load photo');
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id, updatePhoto]);

  if (loading || !photo) {
    return <LoadingScreen message="Loading photo" />;
  }

  return (
    <div class="flex flex-col gap-6 lg:flex-row" data-testid="detail-view">
      <figure class="flex-1 rounded-lg bg-gray-800/60 p-4">
        <img
          src={`/media/${photo.id}/2048`}
          srcset={`/media/${photo.id}/1024 1024w, /media/${photo.id}/2048 2048w`}
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt={photo.captionAi ?? 'Selected photo'}
          class="mx-auto max-h-[70vh] w-full rounded object-contain"
        />
      </figure>
      <div class="flex w-full max-w-md flex-col gap-4">
        <PhotoMeta photo={photo} onUpdated={setPhoto} />
      </div>
      {error ? <p class="text-sm text-red-300">{error}</p> : null}
    </div>
  );
};

export default Detail;
