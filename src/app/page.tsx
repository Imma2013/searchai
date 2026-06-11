'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const go = (q: string) => router.push(`/search?q=${encodeURIComponent(q)}`);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <span className="text-2xl font-semibold text-gray-900">SearchAI</span>
          </div>
          <p className="text-gray-400 text-sm">3 links. One AI answer. No clutter.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (query.trim()) go(query.trim()); }}>
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3.5 shadow-sm">
            <svg className="w-4 h-4 text-gray-300 mr-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="search-input flex-1 bg-transparent text-gray-900 placeholder-gray-300 text-base border-none outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={!query.trim()}
            className="mt-3 w-full bg-purple-600 text-white py-3 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-30"
          >
            Search
          </button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2 justify-center">
          {['Can Messi dribble?', 'How does GPS work?', 'Best pizza dough recipe', 'Fix sleep schedule'].map((q) => (
            <button key={q} onClick={() => go(q)}
              className="text-xs text-gray-400 bg-white border border-gray-100 rounded-full px-3 py-1.5 hover:border-purple-200 hover:text-purple-600 transition-colors">
              {q}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}