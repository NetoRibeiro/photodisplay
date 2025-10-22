# Photo Display Platform

A lightweight, privacy-first photo display stack optimised for smart TVs, smartphones, and legacy ES5 browsers. The project is split into a Preact PWA frontend, FastAPI backend, and background workers to handle EXIF parsing, geocoding, captioning, and media derivatives.

## Repository Structure

```
frontend/   # Vite + Preact progressive web app
backend/    # FastAPI service exposing upload, metadata, and settings APIs
workers/    # Python worker utilities for EXIF, AI captions, and variants
db_schema.sql  # PlanetScale / Postgres compatible schema
.env.example   # Base configuration keys
```

## Getting Started

### Frontend

```
cd frontend
npm install
npm run dev
```

The PWA targets ES5 browsers via lightweight polyfills and provides gallery, detail, settings, and slideshow routes. Uploads use `fetch` with `FormData` and the UI adapts to TVs (arrow keys + Enter) and mobile touch.

### Backend

```
cd backend
pip install -e .
uvicorn app.main:app --reload
```

The API exposes the required CRUD routes and queues work for background processing. Signed URLs can be provided via AWS S3 (configurable in `.env`).

### Workers

```
cd workers
pip install -e .
```

Workers are orchestrated by your queue of choice (Cloud Tasks, Pub/Sub, SQS). Provided modules encapsulate the EXIF parser, reverse geocode helper, AI caption integration, and Sharp-style derivative generation.

## Development Notes

- OAuth: Google OAuth is expected for authentication; scopes are read-only for Google Photos import.
- Privacy: No EXIF edits—only metadata extraction. Signed URLs default to a one-hour TTL.
- Accessibility: Tailwind utility classes deliver high-contrast UI and keyboard accessibility.
- Performance: Bundle targets <120 KB; service worker caches shell for <2s 3G load.

Refer to `photo_app_instruction.json` for the original product brief.

## Working with Offline Development Containers

This repository is prepared inside an isolated environment without outbound network
access. As a result, automated pushes to GitHub or dependency downloads from the
container are not possible. To share the work upstream:

1. Run `git status` to review pending commits and ensure the history is clean.
2. Create a patch bundle with `git format-patch --stdout origin/main > photodisplay.patch`
   or export the repository directory as an archive.
3. Transfer the patch or archive to a network-enabled machine (for example via the
   file download button in this interface).
4. Apply the patch locally (`git am photodisplay.patch`) or extract the archive, then
   configure your Git remote with `git remote add origin <your-remote-url>`.
5. Push the commits from your local machine using `git push origin <branch>`.

Following these steps allows you to review the generated changes while keeping
credentials and network interactions under your direct control.

### Patch export helper script

For convenience, the repository includes `scripts/export_patch.sh`, which wraps
`git format-patch` for offline use:

```bash
# Export commits relative to a chosen base (e.g. the last synced hash)
./scripts/export_patch.sh <base-commit-or-branch> my-feature.patch

# If you omit the base commit, the script falls back to the repository's first
# commit, producing a patch that contains the entire history.
./scripts/export_patch.sh
```

Run the script from anywhere inside the repository. The generated patch can be
downloaded and applied on a machine that has access to your Git remote, after
which a regular `git push` will publish the commits.
