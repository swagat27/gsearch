'use client';

import { useEffect, useRef, useState } from 'react';

type Platform = {
  name: string;
  desc: string;
  baseUrl: string;
  formats: string[];
  slug?: boolean;
};

const PLATFORMS: Platform[] = [
  {
    name: 'GrabCAD',
    desc: 'Large CAD community library with engineering models shared by professionals.',
    baseUrl: 'https://grabcad.com/library?query=',
    formats: ['STEP', 'IGES', 'STL'],
  },
  {
    name: 'Thingiverse',
    desc: 'Maker community focused on 3D printable designs.',
    baseUrl: 'https://www.thingiverse.com/search?q=',
    formats: ['STL', 'OBJ', '3MF'],
  },
  {
    name: 'Printables',
    desc: 'Prusa community library of 3D printable models.',
    baseUrl: 'https://www.printables.com/search/models?q=',
    formats: ['STL', '3MF', 'OBJ'],
  },
  {
    name: 'MyMiniFactory',
    desc: 'Curated library of tested 3D printable objects.',
    baseUrl: 'https://www.myminifactory.com/search/?query=',
    formats: ['STL', 'OBJ', '3MF'],
  },
  {
    name: 'Sketchfab',
    desc: '3D, AR and VR model library with many downloadable assets.',
    baseUrl: 'https://sketchfab.com/search?q=',
    formats: ['GLTF', 'FBX', 'OBJ'],
  },
  {
    name: 'TraceParts',
    desc: 'Professional CAD component catalogue for standard parts.',
    baseUrl: 'https://www.traceparts.com/en/search?text=',
    formats: ['STEP', 'IGES'],
  },
  {
    name: 'Cults3D',
    desc: 'Creator marketplace for 3D printing designs.',
    baseUrl: 'https://cults3d.com/en/recherche?q=',
    formats: ['STL', 'OBJ', '3MF'],
  },
  {
    name: 'CGTrader',
    desc: 'Professional 3D model marketplace for CAD and rendering.',
    baseUrl: 'https://www.cgtrader.com/3d-models?keywords=',
    formats: ['FBX', 'OBJ', 'STL'],
  },
  {
    name: 'Free3D',
    desc: 'Free 3D model downloads for many use cases.',
    baseUrl: 'https://free3d.com/3d-models/',
    formats: ['FBX', 'OBJ', 'STL'],
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

export default function Home() {
  const [query, setQuery] = useState('');
  const [format, setFormat] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState<SubmittedSearch | null>(null);
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [showPopupNote, setShowPopupNote] = useState(false);
  const resultsRef = useRef<HTMLElement | null>(null);

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
    <div className="text-[#101418]">
      <header className="max-w-[960px] mx-auto px-5 pt-10">
        <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#101418] pb-3">
          <span className="micro-label text-[#6d7278]">CAD Model Index</span>
          <span className="micro-label text-[#6d7278]">Sheet 01 / 01</span>
        </div>
        <div className="flex items-center gap-4 mt-8">
          <span
            aria-hidden="true"
            className="font-spec hidden sm:flex h-14 w-14 shrink-0 items-center justify-center border-2 border-[#101418] text-lg font-semibold bg-[#fdfcfa]"
          >
            G<span className="text-[#ea580c]">/</span>S
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight leading-none">
            GSearch
          </h1>
        </div>
        <p className="font-spec mt-5 text-sm md:text-[15px] text-[#3c434b] max-w-[620px] leading-relaxed">
          Unified CAD model search: one query, deep links into 9 model platforms.
        </p>
        <dl className="mt-8 grid grid-cols-3 border-y border-[#ddd9cc] divide-x divide-[#ddd9cc]">
          <div className="py-3 pr-4">
            <dt className="micro-label text-[#6d7278]">Platforms</dt>
            <dd className="font-spec mt-1 text-xl font-semibold">09</dd>
          </div>
          <div className="py-3 px-4">
            <dt className="micro-label text-[#6d7278]">Formats</dt>
            <dd className="font-spec mt-1 text-xl font-semibold">07</dd>
          </div>
          <div className="py-3 pl-4">
            <dt className="micro-label text-[#6d7278]">Models hosted</dt>
            <dd className="font-spec mt-1 text-xl font-semibold">00</dd>
          </div>
        </dl>
      </header>

      <main className="max-w-[960px] mx-auto px-5">
        <section aria-label="Search CAD models" className="my-12">
          <p className="micro-label text-[#c2410c] mb-3">01 · Query</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
            <label htmlFor="gsearch-query" className="sr-only">
              Search CAD models
            </label>
            <input
              id="gsearch-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search CAD models, e.g. gear, bracket, engine mount"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'gsearch-error' : undefined}
              className="font-spec flex-1 px-5 py-4 bg-[#fdfcfa] border-[1.5px] border-[#101418] rounded-[4px] text-base text-[#101418] placeholder:text-[#6d7278] outline-none transition-colors duration-150 focus:border-[#ea580c]"
            />
            <button
              type="submit"
              className="micro-label px-8 py-4 bg-[#101418] text-[#f7f6f2] border-[1.5px] border-[#101418] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-[#ea580c] hover:border-[#ea580c]"
            >
              Search
            </button>
          </form>

          {error && (
            <p
              id="gsearch-error"
              role="alert"
              className="mt-3 text-sm text-[#b3261e] border-l-2 border-[#b3261e] pl-3"
            >
              {error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="micro-label text-[#6d7278]">Format</span>
            <div className="inline-flex flex-wrap gap-2 align-middle" role="group" aria-label="Filter by file format">
              <button
                type="button"
                onClick={() => setFormat('')}
                aria-pressed={format === ''}
                className={`font-spec px-3 py-1.5 rounded-[4px] border text-[13px] cursor-pointer transition-colors duration-150 ${
                  format === ''
                    ? 'bg-[#101418] border-[#101418] text-[#f7f6f2]'
                    : 'bg-transparent border-[#c9c4b2] text-[#3c434b] hover:border-[#101418] hover:text-[#101418]'
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
                  className={`font-spec px-3 py-1.5 rounded-[4px] border text-[13px] cursor-pointer transition-colors duration-150 ${
                    format === f
                      ? 'bg-[#101418] border-[#101418] text-[#f7f6f2]'
                      : 'bg-transparent border-[#c9c4b2] text-[#3c434b] hover:border-[#101418] hover:text-[#101418]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="micro-label text-[#6d7278]">Try</span>
            <div className="inline-flex flex-wrap gap-2 align-middle">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExample(example)}
                  className="font-spec px-3 py-1.5 rounded-[4px] bg-transparent border border-[#ddd9cc] text-[13px] text-[#3c434b] cursor-pointer transition-colors duration-150 hover:border-[#ea580c] hover:text-[#c2410c]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {recent.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="micro-label text-[#6d7278]">Recent</span>
              <div className="inline-flex flex-wrap gap-2 align-middle">
                {recent.map((entry) => (
                  <button
                    key={`${entry.query}|${entry.format}`}
                    type="button"
                    onClick={() => handleRecentClick(entry)}
                    className="font-spec px-3 py-1.5 rounded-[4px] bg-[#fdfcfa] border border-[#ddd9cc] text-[13px] text-[#3c434b] cursor-pointer transition-colors duration-150 hover:border-[#101418] hover:text-[#101418]"
                  >
                    {entry.format ? `${entry.query} (${entry.format})` : entry.query}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearRecent}
                  className="micro-label px-2 py-1.5 bg-transparent border-0 text-[#6d7278] cursor-pointer transition-colors duration-150 hover:text-[#b3261e]"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </section>

        {submitted && (
          <section ref={resultsRef} aria-label="Search results by platform" className="mb-14">
            <p className="micro-label text-[#c2410c] mb-3">02 · Index of results</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
              Results for{' '}
              <span className="font-spec font-medium">
                &quot;{effectiveQuery(submitted.query, submitted.format)}&quot;
              </span>
            </h2>
            <p className="text-sm text-[#6d7278] mt-2 max-w-[620px] leading-relaxed">
              GSearch does not host models. Each card below runs your exact query on that platform.
            </p>
            <button
              type="button"
              onClick={handleOpenAll}
              className="micro-label mt-5 px-6 py-3 bg-[#ea580c] text-white border-[1.5px] border-[#ea580c] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-[#101418] hover:border-[#101418]"
            >
              Open all 9 platforms
            </button>
            {showPopupNote && (
              <p
                role="status"
                className="mt-4 text-sm text-[#8a5a00] border-l-2 border-[#ea580c] pl-3 max-w-[620px] leading-relaxed"
              >
                Opening 9 tabs in sequence. Your browser may block some of these popups, in which
                case use the &quot;Open results&quot; button on each card below, that is always a
                way in.
              </p>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 mt-6">
              {PLATFORMS.map((platform, index) => {
                const url = buildUrl(platform, submitted.query, submitted.format);
                return (
                  <article
                    key={platform.name}
                    className="group bg-[#fdfcfa] border border-[#ddd9cc] rounded-[6px] p-5 transition-colors duration-150 hover:border-[#101418]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        aria-hidden="true"
                        className="font-spec flex h-10 w-10 shrink-0 items-center justify-center border border-[#101418] text-[13px] font-semibold bg-[#f7f6f2]"
                      >
                        {platformMark(platform.name)}
                      </span>
                      <span className="font-spec text-sm text-[#6d7278] transition-colors duration-150 group-hover:text-[#ea580c]">
                        {indexLabel(index)}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-[#101418] mt-4">
                      {platform.name}
                    </h3>
                    <p className="text-sm text-[#6d7278] mt-1 leading-relaxed">{platform.desc}</p>
                    <p className="mt-4">
                      <span className="micro-label text-[#6d7278] block mb-1">Query</span>
                      <span className="font-spec text-sm text-[#101418]">
                        {effectiveQuery(submitted.query, submitted.format)}
                      </span>
                    </p>
                    <p className="font-spec text-xs text-[#6d7278] mt-2 break-all leading-relaxed">
                      {url}
                    </p>
                    <p className="mt-4">
                      <span className="micro-label text-[#6d7278] block mb-1.5">Formats</span>
                      <span className="inline-flex flex-wrap gap-1.5">
                        {platform.formats.map((f) => (
                          <span
                            key={f}
                            className="font-spec text-[11px] px-1.5 py-0.5 border border-[#ddd9cc] rounded-[3px] text-[#3c434b]"
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
                      className="font-spec inline-block mt-5 text-[13px] font-medium text-[#101418] no-underline border-b-2 border-[#ea580c] pb-0.5 transition-colors duration-150 hover:text-[#c2410c]"
                    >
                      Open results →
                    </a>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section aria-label="Browse platforms" className="mb-14">
          <p className="micro-label text-[#c2410c] mb-3">03 · Parts index</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            Browse all 9 platforms
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            {PLATFORMS.map((platform, index) => (
              <button
                key={platform.name}
                type="button"
                onClick={() => handleBrowseClick(platform)}
                aria-label={`Search on ${platform.name}`}
                className="group bg-[#fdfcfa] border border-[#ddd9cc] rounded-[6px] p-5 cursor-pointer text-left transition-colors duration-150 hover:border-[#101418]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="font-spec flex h-10 w-10 shrink-0 items-center justify-center border border-[#101418] text-[13px] font-semibold bg-[#f7f6f2]"
                  >
                    {platformMark(platform.name)}
                  </span>
                  <span className="font-spec text-sm text-[#6d7278] transition-colors duration-150 group-hover:text-[#ea580c]">
                    {indexLabel(index)}
                  </span>
                </div>
                <div className="font-display font-semibold text-[#101418] mt-4">{platform.name}</div>
                <div className="text-sm text-[#6d7278] mt-1 leading-relaxed">{platform.desc}</div>
                <div className="font-spec text-[11px] tracking-wide text-[#6d7278] mt-3">
                  {platform.formats.join(' / ')}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section aria-label="How GSearch works" className="mb-14">
          <p className="micro-label text-[#c2410c] mb-3">04 · Method</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-6">
            How it works
          </h2>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 list-none">
            <li className="border-t-2 border-[#101418] pt-4">
              <div className="font-spec text-[#ea580c] text-sm font-semibold">01</div>
              <div className="font-display font-semibold text-[#101418] mt-2">1. Type one query</div>
              <p className="text-sm text-[#6d7278] mt-1 leading-relaxed">
                Enter what you need, and optionally pick a file format such as STEP or STL.
              </p>
            </li>
            <li className="border-t-2 border-[#101418] pt-4">
              <div className="font-spec text-[#ea580c] text-sm font-semibold">02</div>
              <div className="font-display font-semibold text-[#101418] mt-2">
                2. Review the dashboard
              </div>
              <p className="text-sm text-[#6d7278] mt-1 leading-relaxed">
                See one card per platform with the exact query it will run and the formats it is
                known for.
              </p>
            </li>
            <li className="border-t-2 border-[#101418] pt-4">
              <div className="font-spec text-[#ea580c] text-sm font-semibold">03</div>
              <div className="font-display font-semibold text-[#101418] mt-2">
                3. Open your results
              </div>
              <p className="text-sm text-[#6d7278] mt-1 leading-relaxed">
                Open a single platform, or all 9 in sequence, and download from the original site.
              </p>
            </li>
          </ol>
        </section>

        <section aria-label="Supported formats" className="mb-14">
          <p className="micro-label text-[#c2410c] mb-3">05 · Specification</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-5">
            Supported formats
          </h2>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <span
                key={f}
                className="font-spec px-3 py-1.5 rounded-[4px] bg-[#fdfcfa] border border-[#c9c4b2] text-[13px] text-[#101418]"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="text-sm text-[#6d7278] mt-4 leading-relaxed">
            Selecting a format adds it to the query sent to every platform, for example
            &quot;gear STEP&quot;.
          </p>
        </section>
      </main>

      <footer className="max-w-[960px] mx-auto px-5 pb-10">
        <div className="border-t-2 border-[#101418] pt-5 flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
          <p className="text-sm text-[#3c434b]">
            Built by Swagat Baghel, IIT BHILAI{' '}
            <span aria-hidden="true" className="text-[#c9c4b2]">
              |
            </span>{' '}
            <a
              href="https://github.com/swagat27/gsearch"
              target="_blank"
              rel="noopener noreferrer"
              className="font-spec text-[13px] text-[#101418] no-underline border-b-2 border-[#ea580c] pb-0.5 transition-colors duration-150 hover:text-[#c2410c]"
            >
              View on GitHub
            </a>
          </p>
          <p className="micro-label text-[#6d7278]">GSearch · Static site · No models hosted</p>
        </div>
      </footer>
    </div>
  );
}
