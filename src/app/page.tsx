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
    <div>
      <header className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-b border-[#30363d] p-8 text-center">
        <h1 className="text-4xl font-bold text-[#58a6ff] tracking-tight">GSearch</h1>
        <p className="text-[#8b949e] mt-2 text-base">
          Unified CAD model search: one query, deep links into 9 model platforms.
        </p>
      </header>

      <main className="max-w-[900px] mx-auto px-4">
        <section aria-label="Search CAD models" className="my-10">
          <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
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
              className="flex-1 p-3 bg-[#161b22] border border-[#30363d] rounded-lg text-[#c9d1d9] outline-none transition-colors focus:border-[#58a6ff]"
            />
            <button
              type="submit"
              className="px-6 bg-[#238636] text-white border-0 rounded-lg cursor-pointer transition-colors hover:bg-[#2ea043]"
            >
              Search
            </button>
          </form>

          {error && (
            <p id="gsearch-error" role="alert" className="mt-3 text-sm text-[#f85149]">
              {error}
            </p>
          )}

          <div className="mt-5">
            <span className="text-sm text-[#8b949e] mr-2">Format:</span>
            <div className="inline-flex flex-wrap gap-2 align-middle" role="group" aria-label="Filter by file format">
              <button
                type="button"
                onClick={() => setFormat('')}
                aria-pressed={format === ''}
                className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${
                  format === ''
                    ? 'bg-[#1f6feb] border-[#1f6feb] text-white'
                    : 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:border-[#58a6ff]'
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
                  className={`px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${
                    format === f
                      ? 'bg-[#1f6feb] border-[#1f6feb] text-white'
                      : 'bg-[#161b22] border-[#30363d] text-[#c9d1d9] hover:border-[#58a6ff]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <span className="text-sm text-[#8b949e] mr-2">Try:</span>
            <div className="inline-flex flex-wrap gap-2 align-middle">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => handleExample(example)}
                  className="px-3 py-1.5 rounded-full bg-[#21262d] border border-[#30363d] text-sm text-[#c9d1d9] cursor-pointer transition-colors hover:border-[#58a6ff]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {recent.length > 0 && (
            <div className="mt-4">
              <span className="text-sm text-[#8b949e] mr-2">Recent:</span>
              <div className="inline-flex flex-wrap gap-2 align-middle">
                {recent.map((entry) => (
                  <button
                    key={`${entry.query}|${entry.format}`}
                    type="button"
                    onClick={() => handleRecentClick(entry)}
                    className="px-3 py-1.5 rounded-full bg-[#21262d] border border-[#30363d] text-sm text-[#c9d1d9] cursor-pointer transition-colors hover:border-[#58a6ff]"
                  >
                    {entry.format ? `${entry.query} (${entry.format})` : entry.query}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearRecent}
                  className="px-3 py-1.5 rounded-full bg-transparent border border-[#30363d] text-sm text-[#8b949e] cursor-pointer transition-colors hover:border-[#f85149] hover:text-[#f85149]"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </section>

        {submitted && (
          <section ref={resultsRef} aria-label="Search results by platform" className="mb-12">
            <h2 className="text-[#58a6ff] text-xl mb-2">
              Results for &quot;{effectiveQuery(submitted.query, submitted.format)}&quot;
            </h2>
            <p className="text-sm text-[#8b949e] mb-4">
              GSearch does not host models. Each card below runs your exact query on that platform.
            </p>
            <button
              type="button"
              onClick={handleOpenAll}
              className="mb-4 px-5 py-2.5 bg-[#238636] text-white border-0 rounded-lg cursor-pointer transition-colors hover:bg-[#2ea043]"
            >
              Open all 9 platforms
            </button>
            {showPopupNote && (
              <p role="status" className="mb-4 text-sm text-[#d29922]">
                Opening 9 tabs in sequence. Your browser may block some of these popups, in which
                case use the &quot;Open results&quot; button on each card below, that is always a
                way in.
              </p>
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
              {PLATFORMS.map((platform) => {
                const url = buildUrl(platform, submitted.query, submitted.format);
                return (
                  <article
                    key={platform.name}
                    className="bg-[#161b22] border border-[#30363d] rounded-xl p-5"
                  >
                    <h3 className="font-semibold text-[#e6edf3]">{platform.name}</h3>
                    <p className="text-sm text-[#8b949e] mt-1">{platform.desc}</p>
                    <p className="text-sm text-[#c9d1d9] mt-3">
                      Query:{' '}
                      <span className="font-mono text-[#58a6ff]">
                        {effectiveQuery(submitted.query, submitted.format)}
                      </span>
                    </p>
                    <p className="text-xs text-[#8b949e] mt-1 font-mono break-all">{url}</p>
                    <p className="text-sm text-[#8b949e] mt-3">
                      Known for: {platform.formats.join(', ')}
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open results for ${effectiveQuery(submitted.query, submitted.format)} on ${platform.name}`}
                      className="inline-block mt-4 px-4 py-2 bg-[#1f6feb] text-white rounded-lg no-underline text-sm transition-colors hover:bg-[#388bfd]"
                    >
                      Open results
                    </a>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section aria-label="Browse platforms" className="mb-12">
          <h2 className="text-center mb-6 text-[#58a6ff] text-xl">Browse all 9 platforms</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.name}
                type="button"
                onClick={() => handleBrowseClick(platform)}
                aria-label={`Search on ${platform.name}`}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 text-center cursor-pointer transition-all hover:border-[#58a6ff] hover:-translate-y-0.5 text-left"
              >
                <div className="font-semibold text-[#e6edf3]">{platform.name}</div>
                <div className="text-sm text-[#8b949e] mt-1">{platform.desc}</div>
                <div className="text-xs text-[#8b949e] mt-2">
                  Known for: {platform.formats.join(', ')}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section aria-label="How GSearch works" className="mb-12">
          <h2 className="text-center mb-6 text-[#58a6ff] text-xl">How it works</h2>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 list-none">
            <li className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="font-semibold text-[#e6edf3]">1. Type one query</div>
              <p className="text-sm text-[#8b949e] mt-1">
                Enter what you need, and optionally pick a file format such as STEP or STL.
              </p>
            </li>
            <li className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="font-semibold text-[#e6edf3]">2. Review the dashboard</div>
              <p className="text-sm text-[#8b949e] mt-1">
                See one card per platform with the exact query it will run and the formats it is
                known for.
              </p>
            </li>
            <li className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <div className="font-semibold text-[#e6edf3]">3. Open your results</div>
              <p className="text-sm text-[#8b949e] mt-1">
                Open a single platform, or all 9 in sequence, and download from the original site.
              </p>
            </li>
          </ol>
        </section>

        <section aria-label="Supported formats" className="mb-12 text-center">
          <h2 className="mb-4 text-[#58a6ff] text-xl">Supported formats</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {FORMATS.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-full bg-[#21262d] border border-[#30363d] text-sm text-[#c9d1d9]"
              >
                {f}
              </span>
            ))}
          </div>
          <p className="text-sm text-[#8b949e] mt-3">
            Selecting a format adds it to the query sent to every platform, for example
            &quot;gear STEP&quot;.
          </p>
        </section>
      </main>

      <footer className="text-center p-8 border-t border-[#30363d] text-[#8b949e] text-sm">
        Built by Swagat Baghel, IIT BHILAI |{' '}
        <a
          href="https://github.com/swagat27/gsearch"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#58a6ff] no-underline"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
