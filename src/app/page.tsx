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

const EXAMPLES: string[] = ['Gear', 'Engine mount', 'Bracket', 'Drone frame', 'Enclosure', 'Pulley'];

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

function platformMark(name: string): string {
  const caps = name.replace(/[^A-Z0-9]/g, '');
  return (caps || name.slice(0, 2).toUpperCase()).slice(0, 3);
}

function indexLabel(index: number): string {
  return String(index + 1).padStart(2, '0');
}

function EmptyState({ title, guidance }: { title: string; guidance: string }) {
  return (
    <div className="border border-dashed border-[var(--line-strong)] rounded-[6px] bg-[var(--panel)] px-6 py-8 text-center">
      <span
        aria-hidden="true"
        className="font-spec inline-flex h-11 w-11 items-center justify-center border border-[var(--ink)] text-[13px] font-semibold bg-[var(--paper)]"
      >
        00
      </span>
      <h3 className="font-display font-semibold text-lg text-[var(--ink)] mt-4">{title}</h3>
      <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed max-w-[65ch] mx-auto">
        {guidance}
      </p>
    </div>
  );
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
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
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

  useEffect(() => {
    const loadRecent = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as RecentSearch[];
          if (Array.isArray(parsed)) {
            setRecent(parsed.slice(0, 8));
          }
        }
      } catch {
        setRecent([]);
      }
    };
    const timer = window.setTimeout(loadRecent, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const saveRecent = (entry: RecentSearch) => {
    setRecent((prev) => {
      const next = [
        entry,
        ...prev.filter((r) => !(r.query === entry.query && r.format === entry.format)),
      ].slice(0, 8);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage can be unavailable in some browsers; recent searches are optional.
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
      setError('Please enter a search term before searching.');
      setSubmitted(null);
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

  const handleExample = (example: string) => {
    setQuery(example);
    setError('');
  };

  const handleBrowseClick = (platform: Platform) => {
    if (!query.trim()) {
      setError(`Please enter a search term before searching ${platform.name}.`);
      return;
    }
    runSearch(query, format);
  };

  const handleRecentClick = (entry: RecentSearch) => {
    runSearch(entry.query, entry.format);
  };

  const handleOpenAll = () => {
    if (!submitted) return;
    PLATFORMS.forEach((platform, index) => {
      window.setTimeout(() => {
        window.open(buildUrl(platform, submitted.query, submitted.format), '_blank');
      }, index * 300);
    });
    setShowPopupNote(true);
  };

  return (
    <div className="text-[var(--ink)]">
      <header className="max-w-[960px] mx-auto px-5 pt-12 md:pt-16">
        <div className="flex items-center justify-between gap-4 border-b-2 border-[var(--ink)] pb-3">
          <span className="micro-label text-[var(--muted)]">CAD Model Index</span>
          <span className="flex items-center gap-4">
            <span className="micro-label text-[var(--muted)] hidden sm:inline">Sheet 01 / 01</span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              aria-pressed={theme === 'dark'}
              className="inline-flex h-11 w-11 items-center justify-center border border-[var(--line-strong)] rounded-[4px] bg-[var(--panel)] text-[var(--ink)] cursor-pointer transition-colors duration-150 hover:border-[var(--ink)]"
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
          </span>
        </div>
        <div className="flex items-center gap-4 mt-8">
          <span
            aria-hidden="true"
            className="font-spec hidden sm:flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[var(--ink)] text-lg font-semibold bg-[var(--panel)]"
          >
            G<span className="text-[var(--accent)]">/</span>S
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-none">
            GSearch
          </h1>
        </div>
        <p className="font-spec mt-6 text-sm md:text-[15px] text-[var(--ink-soft)] max-w-[65ch] leading-relaxed">
          Unified CAD model search: one query, deep links into 9 model platforms.
        </p>
        <dl className="mt-8 grid grid-cols-3 border-y border-[var(--line)] divide-x divide-[var(--line)]">
          <div className="py-4 pr-4">
            <dt className="micro-label text-[var(--muted)]">Platforms</dt>
            <dd className="font-spec mt-1 text-xl font-semibold">09</dd>
          </div>
          <div className="py-4 px-4">
            <dt className="micro-label text-[var(--muted)]">Formats</dt>
            <dd className="font-spec mt-1 text-xl font-semibold">07</dd>
          </div>
          <div className="py-4 pl-4">
            <dt className="micro-label text-[var(--muted)]">Models hosted</dt>
            <dd className="font-spec mt-1 text-xl font-semibold">00</dd>
          </div>
        </dl>
      </header>

      <main className="max-w-[960px] mx-auto px-5">
        <section aria-label="Search CAD models" className="mt-12 mb-16">
          <p className="micro-label text-[var(--accent-ink)] mb-4">01 · Query</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4" noValidate>
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
                placeholder="Search CAD models, e.g. gear, bracket, engine mount"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'gsearch-error' : undefined}
                className="font-spec px-5 py-4 text-base text-[var(--ink)] placeholder:text-[var(--muted)]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={handleClearQuery}
                  aria-label="Clear search"
                  className="mr-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[4px] bg-transparent border-0 text-[var(--muted)] text-xl leading-none cursor-pointer transition-colors duration-150 hover:text-[var(--ink)]"
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
              className="micro-label min-h-[44px] px-8 py-4 bg-[var(--ink)] text-[var(--on-ink)] border-[1.5px] border-[var(--ink)] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-[var(--on-accent)]"
            >
              Search
            </button>
          </form>

          <p className="text-sm text-[var(--muted)] mt-4 max-w-[650px] leading-relaxed">
            Type a part name, add a file format if you need one, then open the platforms that fit.
            Press <span className="font-spec text-[var(--ink)]">/</span> anywhere on this page to
            jump straight back to the search field.
          </p>

          {error && (
            <p
              id="gsearch-error"
              role="alert"
              className="mt-4 text-sm text-[var(--danger)] border-l-2 border-[var(--danger)] pl-3 max-w-[650px] leading-relaxed"
            >
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="micro-label text-[var(--muted)]">Format</span>
            <div className="inline-flex flex-wrap gap-2 align-middle" role="group" aria-label="Filter by file format">
              <button
                type="button"
                onClick={() => setFormat('')}
                aria-pressed={format === ''}
                className={`font-spec inline-flex items-center min-h-[44px] px-4 py-2 rounded-[4px] border text-[13px] cursor-pointer transition-colors duration-150 ${
                  format === ''
                    ? 'bg-[var(--ink)] border-[var(--ink)] text-[var(--on-ink)]'
                    : 'bg-transparent border-[var(--line-strong)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                }`}
              >
                Any format
              </button>
              {FORMATS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  aria-pressed={format === f}
                  className={`font-spec inline-flex items-center min-h-[44px] px-4 py-2 rounded-[4px] border text-[13px] cursor-pointer transition-colors duration-150 ${
                    format === f
                      ? 'bg-[var(--ink)] border-[var(--ink)] text-[var(--on-ink)]'
                      : 'bg-transparent border-[var(--line-strong)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="micro-label text-[var(--muted)]">Try</span>
            <div className="inline-flex flex-wrap gap-2 align-middle">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExample(example)}
                  className="font-spec inline-flex items-center min-h-[44px] px-4 py-2 rounded-[4px] bg-transparent border border-[var(--line)] text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent-ink)]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="mt-8">
              <span className="micro-label text-[var(--muted)]">Recent</span>
              <div className="mt-3">
                <EmptyState
                  title="No recent searches yet"
                  guidance="Run your first search above and it will be saved here, so you can repeat it later in one click."
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="micro-label text-[var(--muted)]">Recent</span>
              <div className="inline-flex flex-wrap gap-2 align-middle">
                {recent.map((entry) => (
                  <button
                    key={`${entry.query}|${entry.format}`}
                    type="button"
                    onClick={() => handleRecentClick(entry)}
                    className="font-spec inline-flex items-center min-h-[44px] px-4 py-2 rounded-[4px] bg-[var(--panel)] border border-[var(--line)] text-[13px] text-[var(--ink-soft)] cursor-pointer transition-colors duration-150 hover:border-[var(--ink)] hover:text-[var(--ink)]"
                  >
                    {entry.format ? `${entry.query} (${entry.format})` : entry.query}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearRecent}
                  className="micro-label inline-flex items-center min-h-[44px] px-2 bg-transparent border-0 text-[var(--muted)] cursor-pointer transition-colors duration-150 hover:text-[var(--danger)]"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <span className="micro-label text-[var(--muted)]">Category</span>
            <div
              role="group"
              aria-label="Filter platforms by category"
              className="mt-2 flex gap-1 overflow-x-auto border-b border-[var(--line)]"
            >
              {CATEGORIES.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? PLATFORMS.length
                    : PLATFORMS.filter((p) => p.category === cat.id).length;
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    aria-pressed={active}
                    className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap px-4 font-spec text-[13px] cursor-pointer bg-transparent border-b-[3px] transition-colors duration-150 ${
                      active
                        ? 'border-[var(--accent)] font-semibold text-[var(--ink)]'
                        : 'border-transparent text-[var(--muted)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {cat.label}
                    <span className="text-[var(--muted)]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {submitted && (
          <section ref={resultsRef} aria-label="Search results by platform" className="mb-16">
            <p className="micro-label text-[var(--accent-ink)] mb-4">02 · Index of results</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              Results for{' '}
              <span className="font-spec font-medium">
                &quot;{effectiveQuery(submitted.query, submitted.format)}&quot;
              </span>
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2 max-w-[650px] leading-relaxed">
              GSearch does not host models. Each card below runs your exact query on that platform.
            </p>
            <button
              type="button"
              onClick={handleOpenAll}
              className="micro-label inline-flex items-center min-h-[44px] mt-6 px-6 py-3 bg-[var(--accent)] text-[var(--on-accent)] border-[1.5px] border-[var(--accent)] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-[var(--ink)] hover:border-[var(--ink)]"
            >
              Open all 9 platforms
            </button>
            {showPopupNote && (
              <p
                role="status"
                className="mt-4 text-sm text-[var(--note)] border-l-2 border-[var(--accent)] pl-3 max-w-[650px] leading-relaxed"
              >
                Opening 9 tabs in sequence. Your browser may block some of these popups, in which
                case use the &quot;Open results&quot; button on each card below, that is always a
                way in.
              </p>
            )}
            {filteredPlatforms.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  title="No platforms in this category"
                  guidance="No platforms in this category, try All platforms to see every source for this search."
                />
              </div>
            ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 mt-6">
              {filteredPlatforms.map((platform) => {
                const index = PLATFORMS.indexOf(platform);
                const url = buildUrl(platform, submitted.query, submitted.format);
                return (
                  <article
                    key={platform.name}
                    className="group bg-[var(--panel)] border border-[var(--line)] rounded-[6px] p-6 transition-colors duration-150 hover:border-[var(--ink)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        aria-hidden="true"
                        className="font-spec flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--ink)] text-[13px] font-semibold bg-[var(--paper)]"
                      >
                        {platformMark(platform.name)}
                      </span>
                      <span className="font-spec text-sm text-[var(--muted)] transition-colors duration-150 group-hover:text-[var(--accent)]">
                        {indexLabel(index)}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-[var(--ink)] mt-4">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">{platform.desc}</p>
                    <p className="mt-4">
                      <span className="micro-label text-[var(--muted)] block mb-1">Query</span>
                      <span className="font-spec text-sm text-[var(--ink)]">
                        {effectiveQuery(submitted.query, submitted.format)}
                      </span>
                    </p>
                    <p className="font-spec text-xs text-[var(--muted)] mt-2 break-all leading-relaxed">
                      {url}
                    </p>
                    <p className="mt-4">
                      <span className="micro-label text-[var(--muted)] block mb-1.5">Formats</span>
                      <span className="inline-flex flex-wrap gap-1.5">
                        {platform.formats.map((f) => (
                          <span
                            key={f}
                            className="font-spec text-[11px] px-1.5 py-0.5 border border-[var(--line)] rounded-[3px] text-[var(--ink-soft)]"
                          >
                            {f}
                          </span>
                        ))}
                      </span>
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open results for ${effectiveQuery(submitted.query, submitted.format)} on ${platform.name}`}
                      className="font-spec inline-flex items-center min-h-[44px] mt-4 text-[13px] font-medium text-[var(--ink)] no-underline border-b-2 border-[var(--accent)] pb-0.5 transition-colors duration-150 hover:text-[var(--accent-ink)]"
                    >
                      Open results →
                    </a>
                  </article>
                );
              })}
            </div>
            )}
          </section>
        )}

        <section aria-label="Browse platforms" className="mb-16">
          <p className="micro-label text-[var(--accent-ink)] mb-4">03 · Parts index</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            Browse all 9 platforms
          </h2>
          {filteredPlatforms.length === 0 ? (
            <EmptyState
              title="No platforms in this category"
              guidance="No platforms in this category, try All platforms to browse every source."
            />
          ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            {filteredPlatforms.map((platform) => {
              const index = PLATFORMS.indexOf(platform);
              return (
              <button
                key={platform.name}
                type="button"
                onClick={() => handleBrowseClick(platform)}
                aria-label={`Search on ${platform.name}`}
                className="group bg-[var(--panel)] border border-[var(--line)] rounded-[6px] p-6 cursor-pointer text-left transition-colors duration-150 hover:border-[var(--ink)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="font-spec flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--ink)] text-[13px] font-semibold bg-[var(--paper)]"
                  >
                    {platformMark(platform.name)}
                  </span>
                  <span className="font-spec text-sm text-[var(--muted)] transition-colors duration-150 group-hover:text-[var(--accent)]">
                    {indexLabel(index)}
                  </span>
                </div>
                <div className="font-display font-semibold text-[var(--ink)] mt-4">{platform.name}</div>
                <div className="text-sm text-[var(--muted)] mt-1 leading-relaxed">{platform.desc}</div>
                <div className="font-spec text-[11px] tracking-wide text-[var(--muted)] mt-3">
                  {platform.formats.join(' / ')}
                </div>
              </button>
              );
            })}
          </div>
          )}
        </section>

        <section aria-label="How GSearch works" className="mb-16">
          <p className="micro-label text-[var(--accent-ink)] mb-4">04 · Method</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            How it works
          </h2>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 list-none">
            <li className="border-t-2 border-[var(--ink)] pt-4">
              <div className="font-spec text-[var(--accent)] text-sm font-semibold">01</div>
              <div className="font-display font-semibold text-[var(--ink)] mt-2">1. Type one query</div>
              <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
                Enter what you need, and optionally pick a file format such as STEP or STL.
              </p>
            </li>
            <li className="border-t-2 border-[var(--ink)] pt-4">
              <div className="font-spec text-[var(--accent)] text-sm font-semibold">02</div>
              <div className="font-display font-semibold text-[var(--ink)] mt-2">
                2. Review the dashboard
              </div>
              <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
                See one card per platform with the exact query it will run and the formats it is
                known for.
              </p>
            </li>
            <li className="border-t-2 border-[var(--ink)] pt-4">
              <div className="font-spec text-[var(--accent)] text-sm font-semibold">03</div>
              <div className="font-display font-semibold text-[var(--ink)] mt-2">
                3. Open your results
              </div>
              <p className="text-sm text-[var(--muted)] mt-1 leading-relaxed">
                Open a single platform, or all 9 in sequence, and download from the original site.
              </p>
            </li>
          </ol>
        </section>

        <section aria-label="Supported formats" className="mb-16">
          <p className="micro-label text-[var(--accent-ink)] mb-4">05 · Specification</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            Supported formats
          </h2>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <span
                key={f}
                className="font-spec px-3 py-1.5 rounded-[4px] bg-[var(--panel)] border border-[var(--line-strong)] text-[13px] text-[var(--ink)]"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="text-sm text-[var(--muted)] mt-4 leading-relaxed">
            Selecting a format adds it to the query sent to every platform, for example
            &quot;gear STEP&quot;.
          </p>
        </section>
      </main>

      <footer className="max-w-[960px] mx-auto px-5 pb-12">
        <div className="border-t-2 border-[var(--ink)] pt-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
          <p className="text-sm text-[var(--ink-soft)]">
            Built by Swagat Baghel, IIT BHILAI{' '}
            <span aria-hidden="true" className="text-[var(--line-strong)]">
              |
            </span>{' '}
            <a
              href="https://github.com/swagat27/gsearch"
              target="_blank"
              rel="noopener noreferrer"
              className="font-spec text-[13px] text-[var(--ink)] no-underline border-b-2 border-[var(--accent)] pb-0.5 transition-colors duration-150 hover:text-[var(--accent-ink)]"
            >
              View on GitHub
            </a>
          </p>
          <p className="micro-label text-[var(--muted)]">GSearch · Static site · No models hosted</p>
        </div>
      </footer>
    </div>
  );
}
