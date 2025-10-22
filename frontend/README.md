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
