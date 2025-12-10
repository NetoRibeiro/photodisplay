import { PhotoMetadata, UserSettings } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api';

// Token management
let authToken: string | null = localStorage.getItem('auth_token');

function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> ?? {})
  };

  // Add authorization header if token exists
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Token expired or invalid, clear it
      setAuthToken(null);
      throw new Error('Authentication required');
    }
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return (await res.json()) as T;
}

export const apiClient = {
  // Authentication
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      throw new Error('Login failed');
    }
    
    const data = await res.json();
    setAuthToken(data.access_token);
    return data;
  },
  
  register: async (userId: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, password })
    });
    
    if (!res.ok) {
      throw new Error('Registration failed');
    }
    
    return res.json();
  },
  
  logout: () => {
    setAuthToken(null);
  },
  
  getCurrentUser: () => request<{ user_id: string }>('/auth/me'),
  
  // Photo operations
  listPhotos: () => request<PhotoMetadata[]>('/photos'),
  getPhoto: (id: string) => request<PhotoMetadata>(`/photos/${id}`),
  updateNote: (id: string, note: string) =>
    request<PhotoMetadata>(`/photos/${id}/note`, {
      method: 'PATCH',
      body: JSON.stringify({ note })
    }),
  updateLocation: (
    id: string,
    payload: { type: 'label' | 'coords'; label?: string; lat?: number; lon?: number }
  ) =>
    request<PhotoMetadata>(`/photos/${id}/location`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  deleteLocationOverride: (id: string) =>
    request<PhotoMetadata>(`/photos/${id}/location/override`, { method: 'DELETE' }),
  
  // Settings operations
  getSettings: () => request<UserSettings>('/settings'),
  updateSettings: (settings: Partial<UserSettings>) =>
    request<UserSettings>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings)
    })
};
