import axios from 'axios';
import * as cheerio from 'cheerio';
import { DetailType } from '../types';

export async function getWeebCentralDetails(search: string): Promise<DetailType> {
  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    };

    const response = await axios.get(search, { headers });

    let html = response.data;
    let $ = cheerio.load(html);

    const title = $('section.md\\:w-4\\/12 h1.md\\:hidden').first().text().trim();
    const author = $('li:has(strong:contains("Author(s):")) a').text().trim();
    const status = $('li:has(strong:contains("Status:")) a').text().trim();
    const lastChapter = $('#chapter-list .flex a')
      .first()
      .find('span')
      .eq(1)
      .find('span')
      .eq(0)
      .text()
      .trim();
    const coverUrl = $('picture').first().find('img').attr('src');
    const description = $('li:has(strong:contains("Description")) p').text().trim();
    const tags = $('li:has(strong:contains("Tags")) a')
      .map((_, el) => $(el).text().trim())
      .get();
    const releaseDate = $('li:has(strong:contains("Released")) span').text().trim();



    return {
      title,
      author,
      status,
      lastChapter,
      coverUrl,
      description,
      tags,
      releaseDate,
    };
  } catch (error) {
    console.error('Failed to fetch WeebCentral detail:', error);
    throw new Error('Failed to fetch detail');
  }
}
