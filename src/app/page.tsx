'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`); };
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <span className="text-2xl font-semibold text-gray-900">SearchAI</span>
          </div>
          <p className="text-gray-500 text-sm">3 links. One AI answer. No clutter.</p>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <div className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3.5 shadow-sm hover:shadow-md transition-shadow">
            <svg className="w-4 h-4 text-gray-400 mr-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask anything..." className="search-input flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-base border-none outline-none" autoFocus />
          </div>
          <button type="submit" disabled={!query.trim()} className="mt-4 w-full bg-brand-purple text-white py-3 rounded-full font-medium text-sm hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Search</button>
        </form>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {['Can Messi dribble?', 'Best pizza dough recipe', 'How does GPS work?', 'Fix sleep schedule'].map((q) => (
            <button key={q} onClick={() => router.push(`/search?q=${encodeURIComponent(q)}`)} className="text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-purple-300 hover:text-purple-700 transition-colors">{q}</button>
          ))}
        </div>
      </div>
    </main>
  );
}