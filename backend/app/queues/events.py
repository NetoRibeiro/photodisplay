from enum import Enum
from typing import Any, Dict


class JobType(str, Enum):
  EXIF = 'exif'
  GEOCODE = 'geocode'
  CAPTION = 'caption'
  DERIVATIVE = 'derivative'


class Job(Dict[str, Any]):
  type: JobType
  photo_id: str


class QueueManager:
  def __init__(self) -> None:
    self._queue: list[Job] = []

  def enqueue(self, job: Job) -> None:
    self._queue.append(job)

  def drain(self) -> list[Job]:
    jobs = self._queue[:]
    self._queue.clear()
    return jobs
