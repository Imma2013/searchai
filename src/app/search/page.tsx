'use client';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
type SearchResult = { title: string; url: string; domain: string; snippet: string; };
type AIResponse = { answer: string; modelUsed: string; sourceUrl: string; };
type SearchData = { query: string; links: SearchResult[]; ai: AIResponse; };
function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);
  const [data, setData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => { if (!query) return; setInputValue(query); runSearch(query); }, [query]);
  async function runSearch(q: string) {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: q }), signal: abortRef.current.signal });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Search failed'); }
      setData(await res.json());
    } catch (err: unknown) { if (err instanceof Error && err.name !== 'AbortError') setError(err.message || 'Something went wrong'); }
    finally { setLoading(false); }
  }
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); if (inputValue.trim() && inputValue.trim() !== query) router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`); };
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push('/')} className="shrink-0">
            <div className="w-7 h-7 rounded-lg bg-brand-purple flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
          </button>
          <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder-gray-400" placeholder="Search..." />
          </form>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading && (
          <div className="animate-fade-in">
            <div className="text-xs text-gray-400 uppercase tracking-wide mb-3 font-medium">Top links</div>
            {[1,2,3].map(i => (<div key={i} className="bg-white rounded-xl border border-gray-100 p-4 mb-2.5 animate-pulse"><div className="h-3 bg-gray-100 rounded w-1/4 mb-2"/><div className="h-4 bg-gray-200 rounded w-3/4 mb-2"/><div className="h-3 bg-gray-100 rounded w-full"/></div>))}
            <div className="h-px bg-gray-200 my-4"/>
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-5 animate-pulse"><div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-purple-300"/><div className="h-3 bg-purple-200 rounded w-16"/></div><div className="space-y-2"><div className="h-3 bg-purple-100 rounded w-full"/><div className="h-3 bg-purple-100 rounded w-5/6"/></div></div>
          </div>
        )}
        {error && !loading && (<div className="text-center py-12"><div className="text-gray-400 mb-2 text-sm">{error}</div><button onClick={() => runSearch(query)} className="text-purple-600 text-sm hover:underline">Try again</button></div>)}
        {data && !loading && (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-3"><span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Top links</span><span className="text-xs text-gray-300 border border-dashed border-gray-200 rounded px-1.5 py-0.5">ads here soon</span></div>
            {data.links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-xl border border-gray-100 p-4 mb-2.5 hover:border-gray-300 transition-colors group">
                <div className="flex items-center gap-1.5 mb-1"><div className="w-4 h-4 rounded-sm bg-gray-100 shrink-0"/><span className="text-xs text-gray-400">{link.domain}</span></div>
                <div className="text-sm font-medium text-blue-600 group-hover:underline mb-1 leading-snug">{link.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed line-clamp-2">{link.snippet}</div>
              </a>
            ))}
            <div className="h-px bg-gray-200 my-4"/>
            <div className="bg-white rounded-xl border border-purple-100 p-5">
              <div className="flex items-center gap-2 mb-3"><div className="w-2 h-2 rounded-full bg-brand-purple animate-pulse-dot"/><span className="text-xs text-gray-400 uppercase tracking-wide font-medium">AI answer</span><span className="ml-auto text-xs text-gray-300">{data.ai.modelUsed.split('/').pop()}</span></div>
              <p className="text-sm text-gray-700 leading-relaxed">{data.ai.answer}</p>
              {data.ai.sourceUrl && (<a href={data.ai.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-500 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>{(() => { try { return new URL(data.ai.sourceUrl).hostname.replace('www.',''); } catch { return ''; } })()}</a>)}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
export default function SearchPage() {
  return <Suspense fallback={<div className="min-h-screen bg-gray-50"/>}><SearchResults/></Suspense>;
}