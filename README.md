# Image Grid

Free online tool to combine multiple images into a single layout. Choose from preset layouts, adjust gaps and borders, pan & zoom each image, and export as high-resolution PNG.

**Live:** [img-grid.mtosity.com](https://img-grid.mtosity.com)

## Features

- **2–6 images** with multiple layout options per count
- **5 aspect ratios** — 1:1, 4:3, 16:9, 9:16, 3:4
- **Pan & zoom** — scroll to zoom, drag to reposition each image
- **Customizable** — gap size, border radius, background color
- **High-res export** — 1080px, 1440px, 2160px, or 4320px PNG
- **Fully client-side** — no uploads, no server, images never leave your browser

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |

## Tech Stack

- **React 19** — UI
- **Vite 7** — build tool
- **Tailwind CSS 4** — styling
- **Canvas API** — image export

No other runtime dependencies.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design docs.

## License

ISC
