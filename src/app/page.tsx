'use client';

import { useEffect, useRef, useState } from 'react';

type CategoryId = 'cad' | 'print' | 'marketplace';

type Platform = {
  name: string;
  desc: string;
  baseUrl: string;
  formats: string[];
  category: CategoryId;
  slug?: boolean;
};

type CategoryFilter = CategoryId | 'all';

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All platforms' },
  { id: 'cad', label: 'CAD libraries' },
  { id: 'print', label: 'Print communities' },
  { id: 'marketplace', label: 'Marketplaces' },
];

const PLATFORMS: Platform[] = [
  {
    name: 'GrabCAD',
    desc: 'Large CAD community library with engineering models shared by professionals.',
    baseUrl: 'https://grabcad.com/library?query=',
    formats: ['STEP', 'IGES', 'STL'],
    category: 'cad',
  },
  {
    name: 'Thingiverse',
    desc: 'Maker community focused on 3D printable designs.',
    baseUrl: 'https://www.thingiverse.com/search?q=',
    formats: ['STL', 'OBJ', '3MF'],
    category: 'print',
  },
  {
    name: 'Printables',
    desc: 'Prusa community library of 3D printable models.',
    baseUrl: 'https://www.printables.com/search/models?q=',
    formats: ['STL', '3MF', 'OBJ'],
    category: 'print',
  },
  {
    name: 'MyMiniFactory',
    desc: 'Curated library of tested 3D printable objects.',
    baseUrl: 'https://www.myminifactory.com/search/?query=',
    formats: ['STL', 'OBJ', '3MF'],
    category: 'print',
  },
  {
    name: 'Sketchfab',
    desc: '3D, AR and VR model library with many downloadable assets.',
    baseUrl: 'https://sketchfab.com/search?q=',
    formats: ['GLTF', 'FBX', 'OBJ'],
    category: 'marketplace',
  },
  {
    name: 'TraceParts',
    desc: 'Professional CAD component catalogue for standard parts.',
    baseUrl: 'https://www.traceparts.com/en/search?text=',
    formats: ['STEP', 'IGES'],
    category: 'cad',
  },
  {
    name: 'Cults3D',
    desc: 'Creator marketplace for 3D printing designs.',
    baseUrl: 'https://cults3d.com/en/recherche?q=',
    formats: ['STL', 'OBJ', '3MF'],
    category: 'print',
  },
  {
    name: 'CGTrader',
    desc: 'Professional 3D model marketplace for CAD and rendering.',
    baseUrl: 'https://www.cgtrader.com/3d-models?keywords=',
    formats: ['FBX', 'OBJ', 'STL'],
    category: 'marketplace',
  },
  {
    name: 'Free3D',
    desc: 'Free 3D model downloads for many use cases.',
    baseUrl: 'https://free3d.com/3d-models/',
    formats: ['FBX', 'OBJ', 'STL'],
    category: 'marketplace',
    slug: true,
  },
];

const FORMATS: string[] = ['STEP', 'STL', 'OBJ', '3MF', 'IGES', 'FBX', 'GLTF'];
const STORAGE_KEY = 'gsearch-recent-searches';

type RecentSearch = {
  query: string;
  format: string;
};

type SubmittedSearch = {
  query: string;
  format: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function effectiveQuery(query: string, format: string): string {
  return format ? `${query} ${format}` : query;
}

function buildUrl(platform: Platform, query: string, format: string): string {
  const q = effectiveQuery(query, format);
  if (platform.slug) {
    return platform.baseUrl + slugify(q);
  }
  return platform.baseUrl + encodeURIComponent(q);
}

function categoryLabel(category: CategoryId): string {
  return CATEGORIES.find((item) => item.id === category)?.label ?? '';
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedSearch | null>(null);
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [showPopupNote, setShowPopupNote] = useState(false);
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const resultsRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredPlatforms =
    category === 'all' ? PLATFORMS : PLATFORMS.filter((p) => p.category === category);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark' || current === 'light') {
      const timer = window.setTimeout(() => setTheme(current), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const loadRecent = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as RecentSearch[];
          if (Array.isArray(parsed)) {
            setRecent(parsed.slice(0, 6));
          }
        }
      } catch {
        setRecent([]);
      }
    };
    const timer = window.setTimeout(loadRecent, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      window.localStorage.setItem('gsearch-theme', next);
    } catch {
      // Theme persistence is optional if storage is unavailable.
    }
  };

  const handleClearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const saveRecent = (entry: RecentSearch) => {
    setRecent((prev) => {
      const next = [
        entry,
        ...prev.filter((r) => !(r.query === entry.query && r.format === entry.format)),
      ].slice(0, 6);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Recent searches are optional if storage is unavailable.
      }
      return next;
    });
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing else to do if storage is unavailable.
    }
  };

  const scrollToResults = () => {
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const runSearch = (rawQuery: string, rawFormat: string): boolean => {
    const q = rawQuery.trim();
    if (!q) {
      setError('Enter a search term to continue.');
      setSubmitted(null);
      inputRef.current?.focus();
      return false;
    }
    setError('');
    setShowPopupNote(false);
    setQuery(q);
    setFormat(rawFormat);
    setSubmitted({ query: q, format: rawFormat });
    saveRecent({ query: q, format: rawFormat });
    scrollToResults();
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query, format);
  };

  const handleBrowseClick = (platform: Platform) => {
    if (!query.trim()) {
      setError(`Enter a search term before opening ${platform.name}.`);
      inputRef.current?.focus();
      return;
    }
    runSearch(query, format);
  };

  const handleRecentClick = (entry: RecentSearch) => {
    runSearch(entry.query, entry.format);
  };

  const handleOpenAll = () => {
    if (!submitted) return;
    filteredPlatforms.forEach((platform, index) => {
      window.setTimeout(() => {
        window.open(buildUrl(platform, submitted.query, submitted.format), '_blank');
      }, index * 300);
    });
    setShowPopupNote(true);
  };

  return (
    <div className="min-h-screen text-[var(--ink)]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <span className="font-display text-lg font-bold tracking-tight">
          GSearch<span className="text-[var(--accent)]">.</span>
        </span>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/swagat27/gsearch"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-[44px] items-center px-3 text-sm text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)] sm:inline-flex"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            aria-pressed={theme === 'dark'}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[var(--muted)] transition-colors hover:bg-[var(--panel)] hover:text-[var(--ink)]"
          >
            {theme === 'dark' ? (
              <svg
                aria-hidden="true"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[720px] px-5 sm:px-8">
        <section aria-label="Search CAD models" className="pb-4 pt-12 sm:pt-16">
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Find CAD models, faster.
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-relaxed text-[var(--muted)]">
            Search nine CAD and 3D model platforms with one query.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row" noValidate>
            <label htmlFor="gsearch-query" className="sr-only">
              Search CAD models
            </label>
            <div className="search-field flex-1">
              <input
                ref={inputRef}
                id="gsearch-query"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a part or model"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'gsearch-error' : undefined}
                className="px-5 py-4 text-base text-[var(--ink)] placeholder:text-[var(--muted)]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={handleClearQuery}
                  aria-label="Clear search"
                  className="mr-1 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-xl leading-none text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                >
                  ×
                </button>
              ) : (
                <kbd aria-hidden="true" className="search-kbd hidden sm:block">
                  /
                </kbd>
              )}
            </div>
            <button
              type="submit"
              className="min-h-[52px] cursor-pointer rounded-full border border-[var(--ink)] bg-[var(--ink)] px-7 text-sm font-semibold text-[var(--on-ink)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--on-accent)]"
            >
              Search
            </button>
          </form>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor="gsearch-category">
              Platform category
            </label>
            <select
              id="gsearch-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CategoryFilter)}
              className="min-h-[44px] w-full cursor-pointer rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 text-sm text-[var(--ink)]"
            >
              {CATEGORIES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="gsearch-format">
              File format
            </label>
            <select
              id="gsearch-format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="min-h-[44px] w-full cursor-pointer rounded-full border border-[var(--line)] bg-[var(--panel)] px-4 text-sm text-[var(--ink)]"
            >
              <option value="">Any format</option>
              {FORMATS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p id="gsearch-error" role="alert" className="mt-4 text-sm text-[var(--danger)]">
              {error}
            </p>
          )}

          {recent.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span className="text-[var(--muted)]">Recent</span>
              {recent.map((entry) => (
                <button
                  key={`${entry.query}|${entry.format}`}
                  type="button"
                  onClick={() => handleRecentClick(entry)}
                  className="inline-flex min-h-[44px] cursor-pointer items-center border-0 bg-transparent px-0 text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                >
                  {entry.format ? `${entry.query} · ${entry.format}` : entry.query}
                </button>
              ))}
              <button
                type="button"
                onClick={clearRecent}
                className="inline-flex min-h-[44px] cursor-pointer items-center border-0 bg-transparent px-0 text-[var(--muted)] transition-colors hover:text-[var(--danger)]"
              >
                Clear
              </button>
            </div>
          )}
        </section>

        {submitted ? (
          <section ref={resultsRef} aria-label="Search results by platform" className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  Results for &quot;{effectiveQuery(submitted.query, submitted.format)}&quot;
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {filteredPlatforms.length}{' '}
                  {filteredPlatforms.length === 1 ? 'platform' : 'platforms'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAll}
                className="min-h-[44px] cursor-pointer rounded-full border border-[var(--line-strong)] bg-transparent px-5 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
              >
                Open all
              </button>
            </div>

            {showPopupNote && (
              <p role="status" className="mt-4 text-sm leading-relaxed text-[var(--note)]">
                Opening the selected platforms in new tabs. If your browser blocks any of them,
                use the Open link on that row.
              </p>
            )}

            {filteredPlatforms.length === 0 ? (
              <p className="border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
                No platforms match this category. Choose All platforms to see every source.
              </p>
            ) : (
              <div className="mt-6 border-y border-[var(--line)]">
                {filteredPlatforms.map((platform) => {
                  const url = buildUrl(platform, submitted.query, submitted.format);
                  return (
                    <div
                      key={platform.name}
                      className="flex min-h-[76px] items-center justify-between gap-5 border-b border-[var(--line)] py-4 last:border-b-0"
                    >
                      <div className="min-w-0">
                        <h3 className="font-display text-base font-semibold text-[var(--ink)]">
                          {platform.name}
                        </h3>
                        <p className="mt-1 truncate text-sm text-[var(--muted)]">
                          {categoryLabel(platform.category)} · {platform.formats.join(', ')}
                        </p>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open results on ${platform.name}`}
                        className="inline-flex min-h-[44px] shrink-0 items-center gap-2 text-sm font-medium text-[var(--ink)] no-underline transition-colors hover:text-[var(--accent-ink)]"
                      >
                        Open <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section aria-label="Browse platforms" className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold tracking-tight">Platforms</h2>
              <p className="text-sm text-[var(--muted)]">{filteredPlatforms.length} sources</p>
            </div>
            {filteredPlatforms.length === 0 ? (
              <p className="border-t border-[var(--line)] py-8 text-sm text-[var(--muted)]">
                No platforms match this category. Choose All platforms to see every source.
              </p>
            ) : (
              <div className="mt-6 border-y border-[var(--line)]">
                {filteredPlatforms.map((platform) => (
                  <button
                    key={platform.name}
                    type="button"
                    onClick={() => handleBrowseClick(platform)}
                    aria-label={`Search on ${platform.name}`}
                    className="flex min-h-[76px] w-full cursor-pointer items-center justify-between gap-5 border-b border-[var(--line)] bg-transparent py-4 text-left last:border-b-0"
                  >
                    <span className="min-w-0">
                      <span className="block font-display text-base font-semibold text-[var(--ink)]">
                        {platform.name}
                      </span>
                      <span className="mt-1 block truncate text-sm text-[var(--muted)]">
                        {categoryLabel(platform.category)} · {platform.formats.join(', ')}
                      </span>
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-[var(--muted)]">
                      →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="mx-auto flex w-full max-w-[720px] flex-col gap-2 px-5 pb-10 pt-16 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>Built by Swagat Baghel, IIT BHILAI</p>
        <a
          href="https://github.com/swagat27/gsearch"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--muted)] no-underline transition-colors hover:text-[var(--ink)]"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
