from dataclasses import dataclass


@dataclass
class CaptionResult:
  caption: str


class AiCaptionWorker:
  def __init__(self, client) -> None:
    self.client = client

  async def generate_caption(self, image_bytes: bytes, language: str = 'en') -> CaptionResult:
    prompt = 'Describe this photo in 240 characters or less.'
    response = await self.client.generate_caption(prompt=prompt, image=image_bytes, language=language)
    caption = response.caption[:240]
    return CaptionResult(caption=caption)
