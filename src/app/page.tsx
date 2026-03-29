'use client';

import { useState } from 'react';

const PLATFORMS = [
  { name: 'GrabCAD', icon: '🖨️', desc: 'CAD community', url: 'https://grabcad.com/library?query=' },
  { name: 'Thingiverse', icon: '🖨️', desc: '3D print models', url: 'https://www.thingiverse.com/search?q=' },
  { name: 'Sketchfab', icon: '🎯', desc: '3D & AR/VR models', url: 'https://sketchfab.com/search?q=' },
  { name: 'TraceParts', icon: '⚙️', desc: 'CAD components', url: 'https://www.traceparts.com/en/search?text=' },
  { name: 'MyMiniFactory', icon: '🏭', desc: 'Curated 3D objects', url: 'https://www.myminifactory.com/search/?query=' },
  { name: 'Printables', icon: '📷', desc: 'Prusa community', url: 'https://www.printables.com/search/models?q=' },
  { name: 'Cults3D', icon: '💡', desc: 'Creator marketplace', url: 'https://cults3d.com/en/recherche?q=' },
  { name: 'Free3D', icon: '🌟', desc: 'Free 3D downloads', url: 'https://free3d.com/3d-models/' },
  { name: 'CGTrader', icon: '💰', desc: 'Professional models', url: 'https://www.cgtrader.com/3d-models?keywords=' }
];

export default function Home() {
  const [query, setQuery] = useState('');

  const doSearch = () => {
    const q = query.trim();
    if (!q) {
      alert('Please enter a search term!');
      return;
    }
    PLATFORMS.forEach(p => window.open(p.url + encodeURIComponent(q), '_blank'));
  };

  const handlePlatformClick = (url: string) => {
    const q = query.trim();
    if (q) {
      window.open(url + encodeURIComponent(q), '_blank');
    } else {
      alert('Please enter a search term first!');
    }
  };

  return (
    <div>
      <header className="bg-gradient-to-br from-[#161b22] to-[#0d1117] border-b border-[#30363d] p-8 text-center">
        <h1 className="text-4xl text-[#58a6ff] -tracking-wider">🔍 GSearch</h1>
        <p className="text-[#8b949e] mt-2 text-base">Unified CAD Model Search — Aggregating 9 platforms in one place</p>
      </header>

      <div className="max-w-[700px] mx-auto my-10 px-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
            placeholder="Search CAD models... e.g. gear, bracket, engine mount"
            className="flex-1 p-3 bg-[#161b22] border border-[#30363d] rounded-lg text-[#c9d1d9] outline-none transition-colors focus:border-[#58a6ff]"
          />
          <button
            onClick={doSearch}
            className="px-6 bg-[#238636] text-white border-0 rounded-lg cursor-pointer transition-colors hover:bg-[#2ea043]"
          >
            Search
          </button>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto mb-12 px-4">
        <h2 className="text-center mb-6 text-[#58a6ff] text-xl">🌐 Search Across All Platforms</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {PLATFORMS.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePlatformClick(p.url)}
              className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 text-center cursor-pointer transition-all hover:border-[#58a6ff] hover:-translate-y-0.5 block text-left"
            >
              <div className="text-3xl mb-2">{p.icon}</div>
              <div className="font-semibold text-[#e6edf3]">{p.name}</div>
              <div className="text-sm text-[#8b949e] mt-1">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <footer className="text-center p-8 border-t border-[#30363d] text-[#8b949e] text-sm">
        Made with ❤️ by <a href="https://github.com/swagat27" className="text-[#58a6ff] no-underline">Swagat Baghel</a> · IIT Bhilai | <a href="https://github.com/swagat27/gsearch" className="text-[#58a6ff] no-underline">View on GitHub</a>
      </footer>
    </div>
  );
}
