# Contributing to GSearch

Thank you for your interest in contributing! GSearch is open-source and welcomes all contributions — bug fixes, new platforms, UI improvements, and documentation.

---

## Getting Started

1. **Fork** the repository
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/gsearch.git
   cd gsearch
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. **Start** the dev server:
   ```bash
   npm run dev
   ```

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature or platform |
| `fix:` | Bug fix |
| `docs:` | Documentation update |
| `chore:` | Maintenance, deps, config |
| `refactor:` | Code restructure (no feature change) |
| `style:` | Formatting, UI polish |

Example:
```
feat: add CGTrader as a 10th search source
fix: handle MyMiniFactory API rate limit
docs: update local setup steps in README
```

---

## Adding a New CAD Platform

1. Add the platform URL and search pattern in the appropriate API/scraper file
2. Update the **Sources table** in `README.md`
3. Add format info if known
4. Test that search results load correctly
5. Open a Pull Request with a clear description

---

## Pull Request Checklist

- [ ] Branch is up-to-date with `main`
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Changes are described clearly in the PR description
- [ ] README updated if adding new platforms

---

## Code of Conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

---

## Questions?

Open an [issue](https://github.com/swagat27/gsearch/issues) or start a [discussion](https://github.com/swagat27/gsearch/discussions).
