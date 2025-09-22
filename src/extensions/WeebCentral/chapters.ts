import axios from 'axios'
import * as cheerio from 'cheerio'

// list of chapters
export async function getWeebCentralChapters(chapterUrl: string): Promise<string[]> {
  try {
    const fullChapterListUrl = chapterUrl.replace(/\/[^\/]+$/, '/full-chapter-list')

    const responseAllMangas = await axios.get(fullChapterListUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      }
    })
    const html = responseAllMangas.data
    const $ = cheerio.load(html)

    // Target all image tags that represent reader pages
    const chapters: any = []

    $('div.flex.items-center').each((_, element) => {
      const text = $(element).find('a').find('span').eq(1).find('span').eq(0).text().trim()
      const href = $(element).find('a').attr('href')
      const releaseDate = $(element).find('a').find('time').attr('datetime') || ''

      // release date

      if (text) {
        chapters.push({ id: href, attributes: { chapter: text, releaseDate } })
      }
    })

    return chapters
  } catch (error) {
    console.error('Failed to fetch WeebCentral pages:', error)
    throw new Error('Failed to fetch pages')
  }
}
