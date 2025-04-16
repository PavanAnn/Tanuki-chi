import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchType } from '../types';

// Define the search result type for WeebCentral.

export async function searchWeebCentral(searchTerm: string): Promise<SearchType[]> {
  if (!searchTerm) {
    throw new Error('Search term is required.');
  }
  
  let allMangas: SearchType[] = [];
  let offset = 0;
  let previousMangas: SearchType[] = [];
  let currentMangas: SearchType[] = [];

  try {
    while (true) {
      const response = await axios.get(
        `https://weebcentral.com/search/data?text=${encodeURIComponent(searchTerm)}&sort=Best%20Match&order=Ascending&display_mode=Full%20Display&offset=${offset}&limit=32`
      );
      const html = response.data;
      const $ = cheerio.load(html);

      currentMangas = [];
      $('article').each((_, element) => {
        const secondSection = $(element).find('section').eq(1);
        const link = secondSection.find('a.link-hover').eq(0);
        const href = link.attr('href');
        const title = link.text().trim();
        // Get cover image from the first section (if available).
        const cover = $(element).find('section').eq(0).find('picture').find('img').attr('src');

        if (title && href) {
          currentMangas.push({ id: href, title, coverUrl: cover });
        }
      });

      if (currentMangas.length === 0) {
        break;
      }

      // If the last title in currentMangas matches the first title in previousMangas, break.
      if (
        previousMangas.length > 0 &&
        previousMangas[0].title === currentMangas[currentMangas.length - 1].title
      ) {
        break;
      }

      allMangas = allMangas.concat(currentMangas);
      offset += 32;
      previousMangas = currentMangas;
    }
    return allMangas;
  } catch (error: any) {
    console.error('Error fetching data from WeebCentral:', error.message);
    throw new Error('Failed to fetch search results');
  }
}
