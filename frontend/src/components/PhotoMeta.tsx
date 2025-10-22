import { useEffect, useRef, useState } from 'preact/hooks';
import { apiClient } from '../apiClient';
import { usePhotos } from '../hooks/usePhotos';
import { PhotoMetadata } from '../types';
import { LocationForm } from './LocationForm';

const MAX_NOTE = 240;

export const PhotoMeta = ({ photo, onUpdated }: { photo: PhotoMetadata; onUpdated?: (photo: PhotoMetadata) => void }) => {
  const { updatePhoto } = usePhotos();
  const [note, setNote] = useState(photo.noteUser ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const [showLocationEditor, setShowLocationEditor] = useState(false);
  const [toast, setToast] = useState<{ message: string; previous: string } | null>(null);
  const toastTimer = useRef<number>();

  useEffect(() => {
    setNote(photo.noteUser ?? '');
  }, [photo.noteUser, photo.id]);

  useEffect(() => {
    setToast(null);
    setShowLocationEditor(false);
  }, [photo.locationOverride, photo.id]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const saveNote = async () => {
    if (note.length > MAX_NOTE) return;
    setSaving(true);
    try {
      const previous = photo.noteUser ?? '';
      const updated = await apiClient.updateNote(photo.id, note);
      updatePhoto(updated);
      onUpdated?.(updated);
      setError(undefined);
      setToast({ message: 'Note saved', previous });
      if (toastTimer.current) {
        window.clearTimeout(toastTimer.current);
      }
      toastTimer.current = window.setTimeout(() => setToast(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save note');
    } finally {
      setSaving(false);
    }
  };

  const undoNote = async () => {
    if (!toast) return;
    setSaving(true);
    try {
      const updated = await apiClient.updateNote(photo.id, toast.previous);
      updatePhoto(updated);
      onUpdated?.(updated);
      setNote(toast.previous);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to undo note');
    } finally {
      setSaving(false);
      setToast(null);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    }
  };

  const revertLocation = async () => {
    setSaving(true);
    try {
      const updated = await apiClient.deleteLocationOverride(photo.id);
      updatePhoto(updated);
      onUpdated?.(updated);
      setShowLocationEditor(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revert location');
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside class="flex w-full flex-col gap-4 rounded-lg bg-gray-800/60 p-4 text-sm md:max-w-md">
      <div>
        <h2 class="text-lg font-semibold text-white">AI Caption</h2>
        <p class="mt-2 text-gray-200" data-testid="caption-ai">
          {photo.captionAi ?? 'Caption pending...'}
        </p>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-white">Your Note</h2>
        <textarea
          maxLength={MAX_NOTE}
          value={note}
          onInput={(event) => setNote((event.target as HTMLTextAreaElement).value)}
          class="mt-2 w-full rounded border border-gray-600 bg-gray-900 p-2 text-gray-100"
          rows={4}
          placeholder="Add context, names, or memories"
          data-testid="note-input"
        />
        <div class="mt-1 flex items-center justify-between text-xs">
          <span
            class={
              note.length >= MAX_NOTE
                ? 'text-red-300'
                : note.length >= MAX_NOTE - 20
                  ? 'text-amber-300'
                  : 'text-gray-400'
            }
            data-testid="note-counter"
          >
            {note.length}/{MAX_NOTE}
          </span>
          <button
            class="rounded bg-accent px-3 py-1 font-semibold text-gray-900 disabled:opacity-50"
            disabled={saving}
            onClick={saveNote}
          >
            {saving ? 'Saving…' : 'Save Note'}
          </button>
        </div>
      </div>

      <div data-testid="location-row">
        <header class="mb-1 flex items-center gap-2 text-gray-300">
          <h2 class="text-lg font-semibold text-white">Location</h2>
          <span class="rounded bg-gray-700/80 px-2 py-0.5 text-xs uppercase tracking-wide" data-testid="location-badge">
            {photo.locationOverride ? 'Edited' : photo.exif.hasGps ? 'From EXIF' : 'Unavailable'}
          </span>
        </header>
        <p class="text-gray-200">{photo.placeDisplay?.label ?? 'Location unavailable'}</p>
        <div class="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
          <button
            class="text-accent underline"
            onClick={() => setShowLocationEditor((value) => !value)}
            data-testid="edit-location"
            type="button"
          >
            {showLocationEditor ? 'Close editor' : 'Edit location'}
          </button>
          {photo.locationOverride ? (
            <button
              class="text-accent underline"
              onClick={revertLocation}
              disabled={saving}
              data-testid="revert-location"
              type="button"
            >
              Revert to EXIF
            </button>
          ) : null}
        </div>
      </div>

      {showLocationEditor ? (
        <LocationForm photo={photo} onUpdated={onUpdated} onClose={() => setShowLocationEditor(false)} />
      ) : null}

      {error ? <p class="text-xs text-red-300">{error}</p> : null}
      {toast ? (
        <div
          class="flex items-center justify-between rounded bg-gray-900/80 px-3 py-2 text-xs text-gray-200"
          role="status"
          data-testid="toast"
        >
          <span>{toast.message}</span>
          <button class="font-semibold text-accent underline" onClick={undoNote} disabled={saving} type="button">
            Undo
          </button>
        </div>
      ) : null}
    </aside>
  );
};
