# Photo Display Workers

Utility modules for handling asynchronous media processing:

- `exif_worker.py` — Extracts GPS metadata solely from EXIF
- `geocode_worker.py` — Reverse geocodes coordinates into display labels
- `derivative_worker.py` — Generates JPEG variants (256/1024/2048)
- `ai_caption_worker.py` — Delegates to an external vision model for ≤240 char captions

Integrate these workers with your queue/batch infrastructure (e.g., Cloud Run jobs, Cloud Tasks, SQS). Each module exposes small, testable units so they can be orchestrated independently.
