import { SearchResult } from './scraper';

export type AIResponse = {
  answer: string;
  modelUsed: string;
  sourceUrl: string;
};

export async function generateAIAnswer(
  query: string,
  results: SearchResult[]
): Promise<AIResponse> {
  const context = results
    .map((r, i) => `Source ${i + 1} (${r.domain}):\nTitle: ${r.title}\nSnippet: ${r.snippet}`)
    .join('\n\n');

  const prompt = `You are a helpful search assistant. Based on the following search results, give a clear, concise answer (2-4 sentences). Be factual and direct — no preamble like "Based on the results".

User question: "${query}"

Search results:
${context}`;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://searchai-1-f2au.onrender.com',
      'X-Title': 'SearchAI',
    },
    body: JSON.stringify({
      model: 'openrouter/free',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as {
    model?: string;
    choices: Array<{ message: { content: string } }>;
  };

  const answer = data.choices?.[0]?.message?.content?.trim() || 'No answer generated.';
  const modelUsed = data.model || 'openrouter/free';

  return {
    answer,
    modelUsed,
    sourceUrl: results[0]?.url || '',
  };
}