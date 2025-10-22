import io
from dataclasses import dataclass
from typing import Optional

import exifread


@dataclass
class ExifResult:
  has_gps: bool
  lat: Optional[float] = None
  lon: Optional[float] = None


def _convert_to_degrees(value):
  d = float(value.values[0].num) / float(value.values[0].den)
  m = float(value.values[1].num) / float(value.values[1].den)
  s = float(value.values[2].num) / float(value.values[2].den)
  return d + (m / 60.0) + (s / 3600.0)


def extract_gps(payload: bytes) -> ExifResult:
  tags = exifread.process_file(io.BytesIO(payload), details=False)
  gps_lat = tags.get('GPS GPSLatitude')
  gps_lat_ref = tags.get('GPS GPSLatitudeRef')
  gps_lon = tags.get('GPS GPSLongitude')
  gps_lon_ref = tags.get('GPS GPSLongitudeRef')

  if not all([gps_lat, gps_lat_ref, gps_lon, gps_lon_ref]):
    return ExifResult(has_gps=False)

  lat = _convert_to_degrees(gps_lat)
  if gps_lat_ref.values[0] != 'N':
    lat *= -1
  lon = _convert_to_degrees(gps_lon)
  if gps_lon_ref.values[0] != 'E':
    lon *= -1

  return ExifResult(has_gps=True, lat=lat, lon=lon)
