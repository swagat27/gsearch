# GSearch

> **A unified CAD model search engine** that aggregates free 3D models from multiple platforms in one place.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-swagat27.github.io%2Fgsearch-blue?style=flat-square)](https://swagat27.github.io/gsearch)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

---

## About

GSearch is an open-source, browser-based CAD model search engine that lets engineers, designers, and makers search across **9 major repositories** simultaneously — saving hours of manual searching across different platforms.

No sign-up required. No API keys needed. Just search and download.

**Built by Swagat Baghel · IIT Bhilai**

---

## Aggregated Sources (9 Platforms)

| # | Platform | Description |
|---|----------|-------------|
| 1 | [GrabCAD](https://grabcad.com) | Largest community for engineers & CAD files |
| 2 | [Thingiverse](https://www.thingiverse.com) | 3D printing models by MakerBot |
| 3 | [Sketchfab](https://sketchfab.com) | 3D & AR/VR models platform |
| 4 | [TraceParts](https://www.traceparts.com) | CAD components for mechanical engineers |
| 5 | [MyMiniFactory](https://www.myminifactory.com) | Curated 3D printable objects |
| 6 | [Printables](https://www.printables.com) | Models by Prusa Research community |
| 7 | [Cults3D](https://cults3d.com) | Independent creators 3D model marketplace |
| 8 | [Free3D](https://free3d.com) | Free and premium 3D model downloads |
| 9 | [CGTrader](https://www.cgtrader.com) | Professional 3D model marketplace |

---

## Supported File Formats

- **CAD Formats:** `.STEP`, `.IGES`, `.SLDPRT`, `.SLDASM`, `.IPT`, `.IAM`, `.CATPART`, `.CATPRODUCT`
- **3D Print Formats:** `.STL`, `.OBJ`, `.3MF`, `.AMF`
- **Mesh/Render Formats:** `.FBX`, `.GLTF`, `.GLB`, `.DAE`, `.PLY`
- **Other:** `.DXF`, `.DWG`, `.F3D`, `.123DX`

---

## Features

- **Unified Search** — One query searches across all 9 platforms
- **Filter by Format** — Narrow results by file type
- **Filter by Source** — Choose specific platforms to search
- **Direct Download Links** — Click through to the original source
- **Fully Client-Side** — No backend, no server, pure HTML/CSS/JS
- **Responsive Design** — Works on desktop and mobile

---

## Local Setup

### Prerequisites
- Git installed on your system
- A modern web browser (Chrome, Firefox, Edge)
- (Optional) A local HTTP server like VS Code Live Server or Python

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/swagat27/gsearch.git

# 2. Navigate into the project folder
cd gsearch

# 3a. Open directly in browser
open index.html

# 3b. OR serve with Python (recommended)
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Push Your Own Changes

```bash
# Initialize (if starting fresh)
git init
git remote add origin https://github.com/swagat27/gsearch.git

# Stage, commit and push
git add .
git commit -m "feat: initial release -- GSearch v1.0"
git push -u origin main
```

---

## Project Structure

```
gsearch/
├── index.html        # Main search interface
├── style.css         # Styling and responsive layout
├── script.js         # Search logic and API aggregation
├── assets/           # Icons and images
└── README.md         # This file
```

---

## Contributing

Pull requests are welcome! If you'd like to add a new CAD platform or improve the UI:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-platform`
3. Commit your changes
4. Open a Pull Request

---

## License

This project is open-source under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ by <strong>Swagat Baghel</strong> &middot; <a href="https://github.com/swagat27">@swagat27</a> &middot; IIT Bhilai</p>
