import { chromium } from 'playwright';

export type SearchResult = {
  title: string;
  url: string;
  domain: string;
  snippet: string;
};

export async function scrapeSearchResults(query: string): Promise<SearchResult[]> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    await page.goto(
      `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=10`,
      { waitUntil: 'domcontentloaded', timeout: 20000 }
    );

    const results = await page.evaluate(() => {
      const items: { title: string; url: string; snippet: string }[] = [];
      const els = document.querySelectorAll('#b_results .b_algo');
      els.forEach((el) => {
        const titleEl = el.querySelector('h2 a');
        const snippetEl = el.querySelector('.b_caption p');
        if (titleEl && snippetEl) {
          const href = (titleEl as HTMLAnchorElement).href;
          const title = titleEl.textContent?.trim() || '';
          const snippet = snippetEl.textContent?.trim() || '';
          if (href && title && !href.includes('bing.com')) {
            items.push({ title, url: href, snippet });
          }
        }
      });
      return items.slice(0, 3);
    });

    return results.map((r) => ({
      ...r,
      domain: (() => {
        try { return new URL(r.url).hostname.replace('www.', ''); }
        catch { return r.url; }
      })(),
    }));
  } finally {
    await browser.close();
  }
}