# Architecture

## Overview

**Image Grid** is a client-side web app for combining multiple images into a single layout and exporting as high-resolution PNG. Everything runs in the browser — no server, no uploads, no dependencies beyond React.

Live at: `https://img-grid.mtosity.com/`

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Build | Vite | 7.x |
| CSS | Tailwind CSS | 4.x (Vite plugin) |
| Fonts | Inter (Google Fonts) | — |
| Export | Canvas API (native) | — |

**Zero runtime dependencies** beyond React/ReactDOM. No UI library, no state management library, no image processing library.

## Project Structure

```
├── index.html              # Entry HTML with SEO meta tags
├── vite.config.js          # Vite + React + Tailwind plugins
├── package.json
├── public/
│   ├── favicon.svg         # 2x2 grid icon (indigo)
│   ├── robots.txt
│   └── sitemap.xml
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Root layout: Sidebar + Canvas
    ├── Sidebar.jsx         # All controls (count, ratio, layout, gap, color, export)
    ├── Canvas.jsx          # Responsive container, renders ImageBlocks
    ├── ImageBlock.jsx      # Single image: upload, pan, zoom, replace, remove
    ├── LayoutPreview.jsx   # Thumbnail preview for layout selection
    ├── layouts.js          # Layout definitions, aspect ratios, constants
    ├── useImageCombiner.js # Central state hook + canvas export logic
    └── index.css           # Tailwind import + global styles
```

## Architecture Design

### Data Flow

```
useImageCombiner (hook)
  ├── State: images, imageCount, aspectRatio, layoutIndex, gap, bgColor, borderRadius, exportSize
  ├── Actions: upload, remove, swap, transform (pan/zoom)
  └── Export: Canvas API rendering → PNG download
       │
       ▼
   App.jsx
   ├── Sidebar  ← controls read/write state
   └── Canvas   ← reads layout + images
       └── ImageBlock[]  ← per-image interactions
```

All state lives in the `useImageCombiner` hook. Components are purely presentational — they receive state and callbacks as props.

### Image State Shape

Each image entry in the `images` object:

```js
{
  url: string,      // Object URL for preview
  file: File,       // Original file reference
  scale: number,    // Zoom level (1 = cover fit, max 5)
  offsetX: number,  // Pan X as fraction of max pan range [-1, 1]
  offsetY: number,  // Pan Y as fraction of max pan range [-1, 1]
}
```

### Layout System

Layouts are defined in `layouts.js` as arrays of normalized blocks:

```js
{ x: 0, y: 0, w: 0.5, h: 1 }  // left half
{ x: 0.5, y: 0, w: 0.5, h: 1 } // right half
```

Values are fractions of the total canvas. The `getLayouts(count)` function returns all available layouts for a given image count (2–6).

### Pan & Zoom

- **Preview**: `ImageBlock` computes cover dimensions, applies CSS `transform: translate()` with scaled offsets inside an `overflow: hidden` container
- **Export**: `drawCover()` maps the same `scale`/`offsetX`/`offsetY` to canvas `drawImage()` source rect coordinates
- **Offset convention**: `[-1, 1]` range where 0 = centered, -1/+1 = max pan in each direction. This normalizes pan regardless of image or block dimensions.

### Export Pipeline

1. Create offscreen `<canvas>` at target export size
2. Fill background color
3. For each block: compute pixel position from normalized layout
4. Load each image, clip to block bounds (with optional border radius)
5. `drawCover()` renders the image with pan/zoom transform
6. Trigger download via `canvas.toDataURL("image/png")`

## Key Design Decisions

- **No server** — all processing is client-side via Canvas API and Object URLs
- **Normalized offsets** — pan stored as `[-1, 1]` fraction, not pixels, so transforms are resolution-independent and work identically in preview and export
- **Cover-first zoom** — scale=1 means the image exactly covers the block (CSS `object-fit: cover` equivalent). Zooming in crops further; you can never zoom out past cover
- **Tailwind v4 with layers** — utilities are in CSS layers; avoid unlayered `*` resets that override them (the `padding: 0` gotcha)

## Development

```bash
npm install     # install dependencies
npm run dev     # start dev server (Vite)
npm run build   # production build → dist/
npm run preview # preview production build
```

## Notes

- Tailwind v4 uses `@import "tailwindcss"` — no `tailwind.config.js` needed
- Wheel events on ImageBlock use `{ passive: false }` via `addEventListener` (not React's `onWheel`) to allow `preventDefault()` for zoom
- The `*` CSS reset intentionally omits `padding: 0` to avoid conflicting with Tailwind's layered utility classes
- Export scales gap and border-radius proportionally to the export size using a base reference of 600px
