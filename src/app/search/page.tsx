'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Link = { title: string; url: string; domain: string; snippet: string };
type AI = { answer: string; modelUsed: string; sourceUrl: string };
type Data = { query: string; links: Link[]; ai: AI };

function Results() {
  const params = useSearchParams();
  const router = useRouter();
  const query = params.get('q') || '';
  const [input, setInput] = useState(query);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query) return;
    setInput(query);
    search(query);
  }, [query]);

  async function search(q: string) {
    if (abort.current) abort.current.abort();
    abort.current = new AbortController();
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
        signal: abort.current.signal,
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Search failed');
      setData(await res.json());
    } catch (e: unknown) {
      if (e instanceof Error && e.name !== 'AbortError') setError(e.message);
    } finally { setLoading(false); }
  }

  const Skeleton = () => (
    <div className="animate-pulse space-y-2.5">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="h-3 bg-gray-100 rounded w-1/4 mb-2"/>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/>
          <div className="h-3 bg-gray-100 rounded w-full"/>
        </div>
      ))}
      <div className="h-px bg-gray-100 my-3"/>
      <div className="bg-purple-50 rounded-xl border border-purple-100 p-5">
        <div className="flex gap-2 items-center mb-3">
          <div className="w-2 h-2 rounded-full bg-purple-200"/>
          <div className="h-3 bg-purple-200 rounded w-16"/>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-purple-100 rounded w-full"/>
          <div className="h-3 bg-purple-100 rounded w-4/5"/>
          <div className="h-3 bg-purple-100 rounded w-3/5"/>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push('/')} className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <form onSubmit={(e) => { e.preventDefault(); if (input.trim() !== query) router.push(`/search?q=${encodeURIComponent(input.trim())}`); }} className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
              placeholder="Search..."
            />
          </form>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-6">
        {loading && <Skeleton />}

        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm mb-3">{error}</p>
            <button onClick={() => search(query)} className="text-purple-600 text-sm hover:underline">Try again</button>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-0">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Top links</span>
              <span className="text-xs text-gray-200 border border-dashed border-gray-200 rounded px-1.5 py-0.5">ads soon</span>
            </div>

            {data.links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-gray-100 p-4 mb-2.5 hover:border-gray-200 transition-colors group">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-3.5 h-3.5 rounded-sm bg-gray-100"/>
                  <span className="text-xs text-gray-400">{link.domain}</span>
                </div>
                <div className="text-sm font-medium text-blue-600 group-hover:underline mb-1">{link.title}</div>
                <div className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{link.snippet}</div>
              </a>
            ))}

            <div className="h-px bg-gray-100 my-4"/>

            <div className="bg-white rounded-xl border border-purple-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-purple-500"/>
                <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">AI Answer</span>
                <span className="ml-auto text-xs text-gray-200">{data.ai.modelUsed.split('/').pop()}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{data.ai.answer}</p>
              {data.ai.sourceUrl && (
                <a href={data.ai.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  {(() => { try { return new URL(data.ai.sourceUrl).hostname.replace('www.',''); } catch { return ''; } })()}
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50"/>}><Results/></Suspense>;
}