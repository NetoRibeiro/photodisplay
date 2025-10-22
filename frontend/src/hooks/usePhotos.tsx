import { ComponentChildren, createContext } from 'preact';
import { useContext, useEffect, useMemo, useState } from 'preact/hooks';
import { apiClient } from '../apiClient';
import { PhotoMetadata, UserSettings } from '../types';

type PhotoContextValue = {
  photos: PhotoMetadata[];
  loading: boolean;
  error?: string;
  refresh: () => void;
  settings?: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updatePhoto: (photo: PhotoMetadata) => void;
};

const PhotoContext = createContext<PhotoContextValue | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ComponentChildren }) => {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [settings, setSettings] = useState<UserSettings>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [photosResponse, settingsResponse] = await Promise.all([
        apiClient.listPhotos(),
        apiClient.getSettings().catch(() => undefined)
      ]);
      setPhotos(photosResponse);
      if (settingsResponse) {
        setSettings(settingsResponse);
      }
      setError(undefined);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const value = useMemo<PhotoContextValue>(
    () => ({
      photos,
      loading,
      error,
      refresh: fetchAll,
      settings,
      updateSettings: async (payload) => {
        const updated = await apiClient.updateSettings(payload);
        setSettings(updated);
      },
      updatePhoto: (photo) => {
        setPhotos((current) => {
          const exists = current.some((p) => p.id === photo.id);
          return exists ? current.map((p) => (p.id === photo.id ? photo : p)) : [photo, ...current];
        });
      }
    }),
    [photos, loading, error, settings]
  );

  return <PhotoContext.Provider value={value}>{children}</PhotoContext.Provider>;
};

export const usePhotos = () => {
  const ctx = useContext(PhotoContext);
  if (!ctx) throw new Error('usePhotos must be used within PhotoProvider');
  return ctx;
};
