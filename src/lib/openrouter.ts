import { SearchResult } from './scraper';
export type AIResponse = { answer: string; modelUsed: string; sourceUrl: string; };
export async function generateAIAnswer(query: string, results: SearchResult[]): Promise<AIResponse> {
  const context = results.map((r, i) => `Source ${i+1} (${r.domain}):\nTitle: ${r.title}\nSnippet: ${r.snippet}`).join('\n\n');
  const prompt = `You are a helpful search assistant. Based on the following search results, give a clear, concise answer (2-4 sentences) to the user's question. Be factual.\n\nUser question: "${query}"\n\nSearch results:\n${context}\n\nAnswer directly and conversationally.`;
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json', 'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', 'X-Title': 'SearchAI' },
    body: JSON.stringify({ model: 'openrouter/free', messages: [{ role: 'user', content: prompt }], max_tokens: 300 }),
  });
  if (!response.ok) throw new Error(`OpenRouter error: ${response.statusText}`);
  const data = await response.json();
  return { answer: data.choices[0]?.message?.content || 'No answer generated.', modelUsed: data.model || 'openrouter/free', sourceUrl: results[0]?.url || '' };
}