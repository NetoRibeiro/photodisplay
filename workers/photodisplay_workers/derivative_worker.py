import io
from dataclasses import dataclass
from typing import Iterable
from PIL import Image


@dataclass
class Variant:
  size: int
  data: bytes


class DerivativeWorker:
  def __init__(self, sizes: Iterable[int] | None = None) -> None:
    self.sizes = list(sizes or [256, 1024, 2048])

  def generate(self, payload: bytes) -> list[Variant]:
    with Image.open(io.BytesIO(payload)) as image:
      image = image.convert('RGB')
      variants: list[Variant] = []
      for size in self.sizes:
        copy = image.copy()
        copy.thumbnail((size, size))
        buffer = io.BytesIO()
        copy.save(buffer, format='JPEG', quality=85)
        variants.append(Variant(size=size, data=buffer.getvalue()))
      return variants
