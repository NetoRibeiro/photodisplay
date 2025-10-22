export type PhotoStatus = 'processing' | 'ready' | 'error';

export interface PhotoLocation {
  label: string;
  country?: string;
}

export interface PhotoLocationOverride {
  type: 'label' | 'coords';
  label?: string;
  lat?: number;
  lon?: number;
  source: 'user';
}

export interface PhotoMetadata {
  id: string;
  userId: string;
  storageKey: string;
  variants: string[];
  captionAi?: string;
  noteUser?: string;
  exif: {
    hasGps: boolean;
    lat?: number;
    lon?: number;
  };
  placeAuto?: PhotoLocation;
  placeDisplay?: PhotoLocation;
  locationOverride?: PhotoLocationOverride | null;
  createdAt: string;
  updatedAt: string;
  status: PhotoStatus;
}

export interface UserSettings {
  userId: string;
  detailOnly: boolean;
  slideshowIntervalSec: number;
}
