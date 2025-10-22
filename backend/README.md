# Photo Display Backend

FastAPI application exposing upload, metadata, and user-settings endpoints for the Photo Display experience.

## Key Endpoints

- `POST /api/photos/upload` — Accepts multipart uploads and enqueues processing jobs
- `GET /api/photos` — List photos for the authenticated user
- `GET /api/photos/{id}` — Retrieve a single photo document
- `PATCH /api/photos/{id}/note` — Store or update a user note (≤240 chars)
- `PATCH /api/photos/{id}/location` — Save user-provided location overrides
- `DELETE /api/photos/{id}/location/override` — Revert to EXIF-derived location
- `PATCH /api/settings` — Update slideshow interval + detail-only flag

## Running Locally

```
python -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload
```

Environment variables are loaded from `.env`. See `.env.example` for defaults. Configure storage credentials for signed URL generation.
