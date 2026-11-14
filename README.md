# GSearch

<p align="center">
  <strong>A unified CAD model search dashboard: one query, deep links into 9 platforms.</strong>
</p>

<p align="center">
  <a href="https://swagat27.github.io/gsearch"><img src="https://img.shields.io/badge/Live%20Demo-swagat27.github.io%2Fgsearch-blue?style=flat-square&logo=github" alt="Live Demo"></a>
  <a href="https://github.com/swagat27/gsearch/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"></a>
  <a href="https://github.com/swagat27/gsearch/stargazers"><img src="https://img.shields.io/github/stars/swagat27/gsearch?style=flat-square" alt="Stars"></a>
  <a href="https://github.com/swagat27/gsearch/issues"><img src="https://img.shields.io/github/issues/swagat27/gsearch?style=flat-square" alt="Issues"></a>
</p>

---

## About

**GSearch** is an open-source, browser-based CAD model search dashboard built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**. Instead of opening 9 sites and typing the same query into each one, you type once in GSearch and it builds the exact search link for every platform.

GSearch is honest about what it does: it is a deep link aggregator. It does not scrape any platform, it does not call any platform API, and it does not host or copy any models. Every result opens on the original platform, in a new tab.

**Built by [Swagat Baghel](https://github.com/swagat27), IIT BHILAI**

---

## Features

- **One query, 9 platforms**: an in-page results dashboard with one card per platform
- **Format-aware queries**: pick STEP, STL, OBJ, 3MF, IGES, FBX, or GLTF, and the format is added to the query sent to every platform, for example "gear STEP"
- **Exact query preview**: every card shows the query and the full search URL it will run before you click
- **Open one or open all**: open a single platform from its card, or open all 9 in sequence (your browser may block some popups, the cards always work)
- **Quick examples**: one click fills the search box with Gear, Engine mount, Bracket, Drone frame, Enclosure, or Pulley
- **Recent searches**: your last 8 searches (query plus format) are stored in your browser (localStorage) and can be re-run or cleared
- **Fully static**: no backend, no database, no tracking, nothing to sign up for
- **Responsive UI**: works on desktop and mobile

---

## Platforms (9)

| # | Platform | What it is known for | Formats it is known for |
|---|----------|----------------------|-------------------------|
| 1 | [GrabCAD](https://grabcad.com) | CAD community library | STEP, IGES, STL |
| 2 | [Thingiverse](https://www.thingiverse.com) | 3D printable designs | STL, OBJ, 3MF |
| 3 | [Printables](https://www.printables.com) | Prusa community library | STL, 3MF, OBJ |
| 4 | [MyMiniFactory](https://www.myminifactory.com) | Curated 3D printable objects | STL, OBJ, 3MF |
| 5 | [Sketchfab](https://sketchfab.com) | 3D, AR and VR models | GLTF, FBX, OBJ |
| 6 | [TraceParts](https://www.traceparts.com) | Professional CAD components | STEP, IGES |
| 7 | [Cults3D](https://cults3d.com) | Creator marketplace | STL, OBJ, 3MF |
| 8 | [CGTrader](https://www.cgtrader.com) | Professional model marketplace | FBX, OBJ, STL |
| 9 | [Free3D](https://free3d.com) | Free 3D model downloads | FBX, OBJ, STL |

Note: Free3D search URLs are slug based, so GSearch converts the query into a hyphenated slug for that platform, for example "engine mount" becomes "engine-mount".

---

## Supported File Formats

The format filter supports: **STEP, STL, OBJ, 3MF, IGES, FBX, GLTF**.

Selecting a format does not filter a central index (there is none). It appends the format to the query, so each platform searches its own library for models matching both your term and that format.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | Framework (static export) |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |

There is no scraping library and no server code. The whole app runs in the browser.

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

# 2. Install dependencies (exact versions from the lockfile)
npm ci

# 3. Start the development server
npm run dev
# Visit http://localhost:3000/gsearch

# 4. Build for production (static export)
npm run build
# Output is in the /out folder
```

---

## Deployment

This project deploys automatically to **GitHub Pages** via GitHub Actions on every push to `main`, using the static export in the `out` folder.

Live at: **https://swagat27.github.io/gsearch**

To deploy your own fork:
1. Fork the repo
2. Go to Settings, then Pages, and set Source to GitHub Actions
3. Push any change to `main`, it deploys automatically

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
  Built by <a href="https://github.com/swagat27"><strong>Swagat Baghel</strong></a>, IIT BHILAI &middot;
  <a href="https://swagat27.github.io/gsearch">Live Demo</a> &middot;
  <a href="https://github.com/swagat27/gsearch">GitHub Repo</a>
</p>
