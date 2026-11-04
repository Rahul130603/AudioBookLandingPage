# Chaptera

**Every Book Has a Voice.**

Chaptera is a cinematic, 3D audiobook experience built with React, Vite, Tailwind CSS, Three.js, React Three Fiber, GSAP, Framer Motion, and Lucide. It pairs a premium editorial interface with a working local audiobook player and a conversion studio that is ready to connect to a real text-to-speech backend.

![Chaptera hero](docs/chaptera-hero.jpg)

## Run locally

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## What is included

- **Cinematic 3D hero** — a procedural hardcover book with cover textures, page flips, shadows, ember particles, orbital sound rings, and mouse/scroll camera movement.
- **Three-part storytelling section** — custom 3D CSS scenes for upload, voice synthesis, and listening, with mouse tilt and scroll reveals.
- **Language experience** — English, Tamil, and Urdu cards with native typography, RTL Urdu, animated waveforms, and real neural voice samples.
- **Conversion studio** — drag-and-drop upload, format validation, language and male/female voice selection, reading-speed control, animated conversion stages, a neural voice preview, and a working sample download.
- **Audiobook player** — real chapter audio, play/pause, ±15 seconds, volume, five playback speeds, chapter navigation, bookmarks stored locally, circular audio analyser, and progress controls.
- **3D featured shelf** — horizontally scrollable/draggable book covers with perspective tilt, hover glow, and a spoken line for every title.
- **Why Chaptera** — seven animated 3D feature vignettes instead of stock icon cards.
- **Scroll-closing finale** — the cover closes as the section enters view, particles dissolve, and a glowing waveform remains.
- **Responsive and accessible** — mobile layouts, keyboard-operable controls, reduced-motion alternatives, focus styles, an optional custom cursor, and a skip link.

## Audio

All voice assets are pre-rendered local MP3s in `public/audio` so the demo works without external services:

- `chapter-01.mp3` – `chapter-04.mp3`: English audiobook demo narrated by Aria.
- `samples/language-*.mp3`: English, Tamil, and Urdu language-card samples.
- `samples/voice-*.mp3`: six voice auditions.
- `samples/book-*.mp3`: previews for the featured shelf.

They were generated with Microsoft Edge neural voices using `scripts/generate-neural-voices.py`. The script is optional; the checked-in audio is enough to run the site. The narration text is original demo content written for Chaptera.

## Conversion API

The studio deliberately does **not** pretend to run real text-to-speech in the browser. The visual progress and sample preview come from the demo adapter in `src/lib/conversionApi.js`. That file is the single integration point for a production backend:

1. Replace `simulateConversion` with a multipart POST to `/api/convert`.
2. Stream progress back through the same `onProgress` callback.
3. Return `{ manifest, previewAudio, downloadName }` with the rendered audiobook URL.

The current UI already handles validation, stages, cancellation, completion, audio previewing, and downloads, so the rest of the Studio does not need to change.

## Structure

```text
src/
  components/
    three/HeroScene.jsx      procedural 3D book scene
    Hero.jsx                 hero layout and entrance timeline
    Studio.jsx               upload and conversion interface
    Player.jsx               audiobook player and bookmark state
    FeaturedBooks.jsx        draggable 3D shelf
    Features.jsx             animated feature glyphs
    FinalCTA.jsx             scroll-driven closing book
    ...
  hooks/
    useAudioSample.js        shared one-at-a-time preview audio
  lib/
    data.js                  books, voices, languages, chapters
    conversionApi.js         API-ready conversion adapter
  index.css                  cinematic design system and responsive motion
public/audio/                local neural demo audio
scripts/                     optional asset-generation utilities
```

## Notes

- Demo conversion runs entirely in the browser and does not upload the manuscript.
- Local voice previews play pre-rendered neural samples. Connecting the API is required for a full-length audiobook generated from the uploaded text.
- Bookmarks are stored in `localStorage` under `chaptera:bookmark:v1`.
