# GSearch

<p align="center">
  <strong>A unified CAD model search engine — search 9 platforms in one click.</strong>
</p>

<p align="center">
  <a href="https://swagat27.github.io/gsearch"><img src="https://img.shields.io/badge/Live%20Demo-swagat27.github.io%2Fgsearch-blue?style=flat-square&logo=github" alt="Live Demo"></a>
  <a href="https://github.com/swagat27/gsearch/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/swagat27/gsearch/stargazers"><img src="https://img.shields.io/github/stars/swagat27/gsearch?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/swagat27/gsearch/issues"><img src="https://img.shields.io/github/issues/swagat27/gsearch?style=flat-square" alt="Issues"></a>
</p>

---

## About

**GSearch** is an open-source, browser-based CAD model search engine built with **Next.js 15**, **React 19**, and **Tailwind CSS**. It aggregates free 3D models from **9 major platforms in parallel** — eliminating the need to manually search each site.

Results are fetched simultaneously via `Promise.allSettled`, so no slow source ever blocks the UI. HTML scraping is best-effort with automatic fallback to direct search links.

**Built by [Swagat Baghel](https://github.com/swagat27) · IIT Bhilai**

---

## Features

- **9-Platform Parallel Search** — one query, all results at once
- **Format Filters** — narrow down by `.STEP`, `.STL`, `.OBJ`, and more
- **Direct Source Links** — links go straight to the original platform
- **Fast & Non-blocking** — `Promise.allSettled` keeps UI responsive
- **Auto-fallback** — if scraping fails, falls back to a search redirect
- **Fully Static** — no backend, no database, deploys anywhere
- **Responsive UI** — works on desktop and mobile

---

## Aggregated Sources (9 Platforms)

| # | Platform | Method | Formats |
|---|----------|--------|---------|
| 1 | [GrabCAD](https://grabcad.com) | HTML scrape + redirect fallback | STEP, IGES, SLDPRT, and more |
| 2 | [Thingiverse](https://www.thingiverse.com) | HTML scrape + redirect fallback | STL, OBJ |
| 3 | [MyMiniFactory](https://www.myminifactory.com) | Public API | STL, OBJ, 3MF |
| 4 | [Sketchfab](https://sketchfab.com) | Public API | GLTF, GLB, FBX, OBJ |
| 5 | [TraceParts](https://www.traceparts.com) | Search redirect fallback | STEP, IGES, DXF |
| 6 | [3DContentCentral](https://www.3dcontentcentral.com) | Search redirect fallback | STEP, IGES, DWG |
| 7 | [NASA 3D Resources](https://nasa3d.arc.nasa.gov) | Search redirect fallback | OBJ, STL |
| 8 | [NIH 3D Print Exchange](https://3dprint.nih.gov) | Search redirect fallback | STL, OBJ |
| 9 | [Printables](https://www.printables.com) | Search redirect fallback | STL, 3MF |

---

## Supported File Formats

| Category | Formats |
|----------|---------|
| CAD | `.STEP` `.IGES` `.SLDPRT` `.SLDASM` `.IPT` `.IAM` `.CATPART` |
| 3D Print | `.STL` `.OBJ` `.3MF` `.AMF` |
| Mesh / Render | `.FBX` `.GLTF` `.GLB` `.DAE` `.PLY` |
| 2D / Drawing | `.DXF` `.DWG` |

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|----------|
| Next.js | 15.x | Framework (static export) |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Cheerio | 1.x | HTML scraping |

---

## Local Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/swagat27/gsearch.git
cd gsearch

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Visit http://localhost:3000/gsearch

# 4. Build for production (static export)
npm run build
# Output is in the /out folder
```

---

## Deployment

This project deploys automatically to **GitHub Pages** via GitHub Actions on every push to `main`.

Live at: **https://swagat27.github.io/gsearch**

To deploy your own fork:
1. Fork the repo
2. Go to Settings > Pages > Source: GitHub Actions
3. Push any change to `main` — it deploys automatically

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/add-new-platform`
3. Commit your changes: `git commit -m 'feat: add XYZ platform'`
4. Push to the branch: `git push origin feature/add-new-platform`
5. Open a Pull Request

---

## Security

Found a vulnerability? Please read [SECURITY.md](SECURITY.md) before reporting.

---

## License

This project is open-source under the **[MIT License](LICENSE)**.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/swagat27"><strong>Swagat Baghel</strong></a> &nbsp;&middot;&nbsp; IIT Bhilai &nbsp;&middot;&nbsp;
  <a href="https://swagat27.github.io/gsearch">Live Demo</a>
</p>
