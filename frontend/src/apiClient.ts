import { PhotoMetadata, UserSettings } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';
const USER_ID = import.meta.env.VITE_USER_ID ?? 'demo-user';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export const apiClient = {
  listPhotos: () => request<PhotoMetadata[]>(`/photos?user_id=${USER_ID}`),
  getPhoto: (id: string) => request<PhotoMetadata>(`/photos/${id}?user_id=${USER_ID}`),
  updateNote: (id: string, note: string) =>
    request<PhotoMetadata>(`/photos/${id}/note?user_id=${USER_ID}`, {
      method: 'PATCH',
      body: JSON.stringify({ note })
    }),
  updateLocation: (
    id: string,
    payload: { type: 'label' | 'coords'; label?: string; lat?: number; lon?: number }
  ) =>
    request<PhotoMetadata>(`/photos/${id}/location?user_id=${USER_ID}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  deleteLocationOverride: (id: string) =>
    request<PhotoMetadata>(`/photos/${id}/location/override?user_id=${USER_ID}`, { method: 'DELETE' }),
  getSettings: () => request<UserSettings>(`/settings?user_id=${USER_ID}`),
  updateSettings: (settings: Partial<UserSettings>) =>
    request<UserSettings>(`/settings?user_id=${USER_ID}`, {
      method: 'PATCH',
      body: JSON.stringify(settings)
    })
};
