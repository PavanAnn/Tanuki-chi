import axios from 'axios'
import * as cheerio from 'cheerio'
import { SearchType } from '../types'
import fs from 'fs'

// Define the search result type for MangaBat.

export async function searchMangaBat(searchTerm: string): Promise<SearchType[]> {
  if (!searchTerm) {
    throw new Error('Search term is required.')
  }

  let allMangas: SearchType[] = []
  let offset = 1
  let previousMangas: SearchType[] = []
  let currentMangas: SearchType[] = []

  try {
    while (true) {
      const response = await axios.get(
        `https://www.mangabats.com/search/story/${encodeURIComponent(searchTerm)}?page=${offset}`,
        {
          decompress: true, // this goes here, NOT inside headers
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            // DON'T include accept-encoding – let Axios and Node auto-negotiate
            'accept-language': 'pt-BR,pt;q=0.7',
            'cache-control': 'max-age=0',
            cookie: 'cf_clearance=YOUR_VALID_CLEARANCE_COOKIE',
            referer: `https://www.mangabats.com/search/story/${encodeURIComponent(searchTerm)}?page=${offset - 1}`,
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
            // Other sec headers optional
          }
        }
      )
      const html = response.data
      const $ = cheerio.load(html)

      currentMangas = []
      $('.story_item').each((_, element) => {
        const secondSection = $(element).find('.story_item_right')
        const link = secondSection.find('h3.story_name a')
        const href = link.attr('href') // OK
        const title = link.text().trim() // MAYBE
        // Get cover image from the first section (if available).
        const cover = $(element).find('a').eq(0).find('img').attr('src')
        if (title && href) {
          currentMangas.push({ id: href, title, coverUrl: cover })
        }
      })

      if (currentMangas.length === 0) {
        break
      }

      // If the last title in currentMangas matches the first title in previousMangas, break.
      if (
        previousMangas.length > 0 &&
        previousMangas[0].title === currentMangas[currentMangas.length - 1].title
      ) {
        break
      }

      allMangas = allMangas.concat(currentMangas)
      offset += 32
      previousMangas = currentMangas
    }
    return allMangas
  } catch (error: any) {
    console.error('Error fetching data from MangaBat:', error.message)
    throw new Error('Failed to fetch search results')
  }
}
