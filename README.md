# GSearch

GSearch is a multi-source CAD model search engine that aggregates free models from nine popular libraries in parallel. It provides a fast unified grid, format filters, and direct source links for downloads.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

## Sources

| Source | Formats | Method |
| --- | --- | --- |
| GrabCAD | Unknown/varies | HTML scrape with fallback search redirect |
| Thingiverse | STL (typical) | HTML scrape with fallback search redirect |
| MyMiniFactory | Unknown/varies | Public API search |
| Sketchfab | Unknown/varies | Public API search |
| TraceParts | Unknown/varies | Search redirect fallback |
| 3DContentCentral | Unknown/varies | Search redirect fallback |
| NASA 3D | Unknown/varies | Search redirect fallback |
| NIH 3D Print | Unknown/varies | Search redirect fallback |
| Printables | Unknown/varies | Search redirect fallback |

## Local setup

1. Install dependencies.

```
npm install
```

2. Start the dev server.

```
npm run dev
```

3. Build for production.

```
npm run build
```

## Notes

- Results are fetched in parallel via `Promise.allSettled` so slow sources never block the UI.
- HTML scraping is best-effort; if a source changes its markup, GSearch falls back to a direct search link for that site.
