import { NextRequest, NextResponse } from 'next/server';
import { scrapeSearchResults } from '@/lib/scraper';
import { generateAIAnswer } from '@/lib/openrouter';
import { supabase } from '@/lib/supabase';
export async function POST(req: NextRequest) {
  try {
    const { query, userId } = await req.json();
    if (!query || typeof query !== 'string' || query.trim().length === 0) return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    const trimmedQuery = query.trim().slice(0, 200);
    const results = await scrapeSearchResults(trimmedQuery);
    if (results.length === 0) return NextResponse.json({ error: 'No results found' }, { status: 404 });
    const aiResponse = await generateAIAnswer(trimmedQuery, results);
    supabase.from('search_logs').insert({ query: trimmedQuery, user_id: userId || null, results_count: results.length, ai_model_used: aiResponse.modelUsed }).then(({ error }) => { if (error) console.error('Supabase log error:', error); });
    return NextResponse.json({ query: trimmedQuery, links: results, ai: aiResponse });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed. Please try again.' }, { status: 500 });
  }
}