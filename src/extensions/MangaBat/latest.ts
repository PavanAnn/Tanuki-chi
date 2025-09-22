import axios from 'axios'
import * as cheerio from 'cheerio'

export async function getLatestMangabat(chapterUrl: string) {
  try {
    console.log('Fetching latest chapter from MangaBat...')

    const response = await axios.get(chapterUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      }
    })

    const $ = cheerio.load(response.data)
    const latestChapter = $('.chapter-list')
      .find('div')
      .eq(0)
      .find('span')
      .eq(0)
      .find('a')
      .text()
      .trim()

    return { lastChapter: latestChapter }
  } catch (error) {
    console.error('Failed to fetch MangaBat pages:', error)
    throw new Error('Failed to fetch pages')
  }
}
