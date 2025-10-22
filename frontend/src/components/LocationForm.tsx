import { useEffect, useState } from 'preact/hooks';
import { apiClient } from '../apiClient';
import { usePhotos } from '../hooks/usePhotos';
import { PhotoMetadata } from '../types';

export const LocationForm = ({
  photo,
  onUpdated,
  onClose
}: {
  photo: PhotoMetadata;
  onUpdated?: (photo: PhotoMetadata) => void;
  onClose?: () => void;
}) => {
  const { updatePhoto } = usePhotos();
  const [mode, setMode] = useState<'label' | 'coords'>(photo.locationOverride?.type ?? 'label');
  const [label, setLabel] = useState(photo.locationOverride?.label ?? photo.placeDisplay?.label ?? '');
  const [lat, setLat] = useState(photo.locationOverride?.lat?.toString() ?? '');
  const [lon, setLon] = useState(photo.locationOverride?.lon?.toString() ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setMode(photo.locationOverride?.type ?? 'label');
    setLabel(photo.locationOverride?.label ?? photo.placeDisplay?.label ?? '');
    setLat(photo.locationOverride?.lat?.toString() ?? '');
    setLon(photo.locationOverride?.lon?.toString() ?? '');
    setError(undefined);
  }, [photo.id, photo.locationOverride, photo.placeDisplay?.label]);

  const save = async () => {
    setSaving(true);
    try {
      if (mode === 'label' && !label.trim()) {
        setError('Please enter a location label.');
        return;
      }
      if (mode === 'coords') {
        if (!lat || !lon) {
          setError('Latitude and longitude are required for coordinates.');
          return;
        }
        if (Number.isNaN(parseFloat(lat)) || Number.isNaN(parseFloat(lon))) {
          setError('Coordinates must be valid numbers.');
          return;
        }
      }

      const payload =
        mode === 'label'
          ? { type: 'label' as const, label: label.trim() }
          : {
              type: 'coords' as const,
              lat: parseFloat(lat),
              lon: parseFloat(lon),
              label: label.trim() || undefined
            };
      const updated = await apiClient.updateLocation(photo.id, payload);
      updatePhoto(updated);
      onUpdated?.(updated);
      setError(undefined);
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update location');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section class="rounded-lg border border-gray-700/70 bg-gray-900/60 p-4" data-testid="location-editor">
      <header class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-300">Location Override</h3>
        <div class="flex gap-2 text-xs">
          <label class="flex items-center gap-1">
            <input
              type="radio"
              name="mode"
              value="label"
              checked={mode === 'label'}
              onChange={() => {
                setMode('label');
                setError(undefined);
              }}
            />
            Label
          </label>
          <label class="flex items-center gap-1">
            <input
              type="radio"
              name="mode"
              value="coords"
              checked={mode === 'coords'}
              onChange={() => {
                setMode('coords');
                setError(undefined);
              }}
            />
            Coordinates
          </label>
        </div>
      </header>
      <div class="flex flex-col gap-3 text-sm">
        <label class="flex flex-col gap-1">
          <span class="text-xs uppercase tracking-wide text-gray-400">Label (optional for coords)</span>
          <input
            value={label}
            onInput={(event) => {
              setLabel((event.target as HTMLInputElement).value);
              setError(undefined);
            }}
            class="rounded border border-gray-700 bg-gray-800 p-2 text-gray-100"
            placeholder="Parc Güell, Barcelona"
          />
        </label>
        {mode === 'coords' ? (
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label class="flex flex-col gap-1">
              <span class="text-xs uppercase tracking-wide text-gray-400">Latitude</span>
              <input
                inputmode="decimal"
                value={lat}
                onInput={(event) => {
                  setLat((event.target as HTMLInputElement).value);
                  setError(undefined);
                }}
                class="rounded border border-gray-700 bg-gray-800 p-2 text-gray-100"
                placeholder="41.4145"
              />
            </label>
            <label class="flex flex-col gap-1">
              <span class="text-xs uppercase tracking-wide text-gray-400">Longitude</span>
              <input
                inputmode="decimal"
                value={lon}
                onInput={(event) => {
                  setLon((event.target as HTMLInputElement).value);
                  setError(undefined);
                }}
                class="rounded border border-gray-700 bg-gray-800 p-2 text-gray-100"
                placeholder="2.1527"
              />
            </label>
          </div>
        ) : null}
        <button
          class="self-start rounded bg-accent px-4 py-2 text-sm font-semibold text-gray-900 disabled:opacity-50"
          onClick={save}
          disabled={saving}
          data-testid="save-location"
        >
          {saving ? 'Saving…' : 'Save Location'}
        </button>
        {error ? <p class="text-xs text-red-300">{error}</p> : null}
      </div>
    </section>
  );
};
