// src/extensions/WeebCentral/pages.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getPages(search: string): Promise<{ text: string; href: string }[]> {
  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    };

    const response = await axios.get(
      `${search}/images?is_prev=False&current_page=1&reading_style=long_strip`,
      { headers }
    );

    const pages: { text: string; href: string }[] = [];

    const html = response.data;
    const $ = cheerio.load(html);

    $('img').each((_, element) => {
      const text = $(element).attr('alt')?.trim() ?? '';
      const href = $(element).attr('src')?.trim();

      if (href) {
        pages.push({ text, href });
      }
    });

    return pages;
  } catch (error) {
    console.error('Failed to fetch WeebCentral pages:', error);
    throw new Error('Failed to fetch pages');
  }
}
