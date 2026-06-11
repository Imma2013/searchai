import OpenRouter from '@openrouter/sdk';
import { SearchResult } from './scraper';

export type AIResponse = {
  answer: string;
  modelUsed: string;
  sourceUrl: string;
};

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function generateAIAnswer(
  query: string,
  results: SearchResult[]
): Promise<AIResponse> {
  const context = results
    .map((r, i) => `Source ${i + 1} (${r.domain}):\nTitle: ${r.title}\nSnippet: ${r.snippet}`)
    .join('\n\n');

  const prompt = `You are a helpful search assistant. Based on the following search results, give a clear, concise answer (2-4 sentences) to the user's question. Be factual and direct — no preamble like "Based on the results".

User question: "${query}"

Search results:
${context}`;

  const response = await client.chat.send({
    model: 'openrouter/free',
    messages: [{ role: 'user', content: prompt }],
  });

  const answer = response.choices[0]?.message?.content || 'No answer generated.';
  const modelUsed = (response as { model?: string }).model || 'openrouter/free';

  return {
    answer,
    modelUsed,
    sourceUrl: results[0]?.url || '',
  };
}