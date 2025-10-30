# Photo Display Frontend

Progressive Web App built with Vite + Preact designed for TVs, smartphones, and legacy browsers.

## Features

- Responsive gallery grid with lazy-loaded thumbnails
- Detail view showing AI caption, notes, EXIF/override badge, and location controls
- Slideshow mode with keyboard/remote navigation and configurable interval
- Settings screen for slideshow preferences and detail-only toggle
- Upload surface using `fetch` + `FormData`
- Service worker + manifest for offline support and installation prompts

## Commands

```
npm install
npm run dev
npm run build
npm run preview
```

Set `VITE_API_BASE` in `.env` to point at the backend API.

# Deploying Frontend to Firebase Hosting

## Build
```bash
npm install
npm run build
```
- Output will appear in `dist/` directory (as per vite.config.ts).

## Deploy
```bash
firebase deploy --only hosting
```

## firebase.json
- Must exist at project root.
- Handles SPA fallback and API proxy:
  * `"public": "frontend/dist"`
  * `rewrites` to Cloud Run backend for `/api/**` requests.

## API Proxy
- All API requests (`/api/*`) from the frontend should be written to proxy via Firebase Hosting to Cloud Run backend for security and CORS simplicity.

## .firebaserc
- Must include your Firebase project ID.

## Google Cloud Best Practices
- Do NOT store secrets in code.
- Use environment variables and Google Secret Manager.