import { NextRequest, NextResponse } from 'next/server';
import { scrapeSearchResults } from '@/lib/scraper';
import { generateAIAnswer } from '@/lib/openrouter';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const trimmedQuery = query.trim().slice(0, 200);

    // Scrape top 3 results
    const results = await scrapeSearchResults(trimmedQuery);

    if (results.length === 0) {
      return NextResponse.json({ error: 'No results found' }, { status: 404 });
    }

    // Generate AI answer using OpenRouter SDK
    const aiResponse = await generateAIAnswer(trimmedQuery, results);

    return NextResponse.json({
      query: trimmedQuery,
      links: results,
      ai: aiResponse,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed. Please try again.' }, { status: 500 });
  }
}