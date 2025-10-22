from dataclasses import dataclass
from typing import Optional

import httpx


@dataclass
class Place:
  label: str
  country: Optional[str] = None


class GeocodeWorker:
  def __init__(self, api_key: str | None = None) -> None:
    self.api_key = api_key

  async def reverse_geocode(self, lat: float, lon: float) -> Optional[Place]:
    params = {
      'format': 'jsonv2',
      'lat': lat,
      'lon': lon
    }
    async with httpx.AsyncClient() as client:
      response = await client.get('https://nominatim.openstreetmap.org/reverse', params=params, timeout=10.0)
      if response.status_code != 200:
        return None
      data = response.json()
      address = data.get('address', {})
      label = data.get('display_name')
      country = address.get('country')
      if not label:
        return None
      return Place(label=label, country=country)
