import axios from 'axios'
import * as cheerio from 'cheerio'

// list of chapters
export async function getMangaBatChapters(chapterUrl: string): Promise<string[]> {
  try {
    const responseAllMangas = await axios.get(chapterUrl, {
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

    $('.chapter-list .row').each((_, element) => {
      const aTag = $(element).find('span').first().find('a')
      const text = aTag.text().trim()
      const href = aTag.attr('href')?.trim()

      if (text && href) {
        chapters.push({ id: href, attributes: { chapter: text } })
      }
    })

    return chapters
  } catch (error) {
    console.error('Failed to fetch WeebCentral pages:', error)
    throw new Error('Failed to fetch pages')
  }
}
