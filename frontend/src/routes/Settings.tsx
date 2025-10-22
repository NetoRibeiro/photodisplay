import { RouteComponentProps } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { usePhotos } from '../hooks/usePhotos';

const MIN_INTERVAL = 3;
const MAX_INTERVAL = 60;

const Settings = (_props: RouteComponentProps) => {
  const { settings, updateSettings } = usePhotos();
  const [detailOnly, setDetailOnly] = useState(settings?.detailOnly ?? false);
  const [interval, setInterval] = useState(settings?.slideshowIntervalSec ?? 5);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (settings) {
      setDetailOnly(settings.detailOnly);
      setInterval(settings.slideshowIntervalSec);
    }
  }, [settings?.detailOnly, settings?.slideshowIntervalSec]);

  const save = async () => {
    setSaving(true);
    try {
      await updateSettings({ detailOnly, slideshowIntervalSec: interval });
      setMessage('Settings saved');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(undefined), 2000);
    }
  };

  return (
    <div class="mx-auto flex w-full max-w-xl flex-col gap-6 rounded-lg bg-gray-800/60 p-6">
      <h1 class="text-2xl font-semibold text-white">Playback Preferences</h1>
      <label class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-gray-200">Detailed view only</p>
          <p class="text-xs text-gray-400">Always open slideshow entries in detail mode.</p>
        </div>
        <input
          type="checkbox"
          checked={detailOnly}
          onChange={(event) => setDetailOnly((event.target as HTMLInputElement).checked)}
          data-testid="detail-only"
        />
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-sm font-medium text-gray-200">Slideshow interval (seconds)</span>
        <input
          type="range"
          min={MIN_INTERVAL}
          max={MAX_INTERVAL}
          value={interval}
          onInput={(event) => setInterval(parseInt((event.target as HTMLInputElement).value, 10))}
          data-testid="slideshow-interval"
        />
        <span class="text-xs text-gray-400">{interval}s</span>
      </label>

      <button
        class="self-start rounded bg-accent px-4 py-2 text-sm font-semibold text-gray-900 disabled:opacity-50"
        onClick={save}
        disabled={saving}
      >
        {saving ? 'Saving…' : 'Save Preferences'}
      </button>

      {message ? <p class="text-xs text-emerald-300">{message}</p> : null}
    </div>
  );
};

export default Settings;
