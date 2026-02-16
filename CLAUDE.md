# CLAUDE.md

## Project

Image Grid — client-side image layout combiner at `img-grid.mtosity.com`. React 19 + Vite 7 + Tailwind CSS 4.

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Architecture

See `ARCHITECTURE.md` for full details.

- All state lives in `src/useImageCombiner.js` hook
- Components are presentational (props in, callbacks out)
- Layouts defined as normalized `{ x, y, w, h }` blocks in `src/layouts.js`
- Pan/zoom offsets use `[-1, 1]` normalized range, not pixels
- Export uses Canvas API with identical transform math to the CSS preview

## Key Files

| File | Purpose |
|------|---------|
| `src/useImageCombiner.js` | All state + export logic |
| `src/ImageBlock.jsx` | Pan/zoom/upload interactions |
| `src/layouts.js` | Layout definitions + constants |
| `src/Canvas.jsx` | Responsive container |
| `src/Sidebar.jsx` | Control panel |

## Conventions

- Tailwind v4 — use `@import "tailwindcss"`, no config file
- No UI library — plain HTML + Tailwind classes
- No state management library — single custom hook pattern
- Avoid `* { padding: 0 }` in CSS — it overrides Tailwind's layered utilities
- Wheel listeners must use `addEventListener` with `{ passive: false }` for `preventDefault()`
- Keep it zero-dependency beyond React — no lodash, no image libs, use native APIs

## Style

- Dark theme: bg `#0a0a0a`, text `#fafafa`, accent indigo `#6366f1`
- Font: Inter (Google Fonts)
- All image processing is client-side (Canvas API, Object URLs)
