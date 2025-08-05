import axios from 'axios'
import * as cheerio from 'cheerio'
import { DetailType } from '../types'

export async function getMangaBatDetails(search: string): Promise<DetailType> {
  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
    }

    const response = await axios.get(search, { headers })

    let html = response.data
    let $ = cheerio.load(html)

    const infoSection = $('.manga-info-text')
    const title = infoSection.find('li').eq(0).find('h1').text().trim()
    const author = infoSection.find('li').eq(1).find('a').eq(0).text().trim()
    const status = infoSection.find('li').eq(2).text().replace('Status :', '').trim()

    const lastChapter = $('.chapter-list')
      .find('div')
      .eq(0)
      .find('span')
      .eq(0)
      .find('a')
      .text()
      .trim()

    const coverUrl = $('.manga-info-pic').find('img').attr('src')
    const description = $('#contentBox').find('h2, p').remove().end().text().trim()
    const tags = infoSection
      .find('li')
      .eq(6)
      .find('a')
      .map((_, el) => $(el).text().trim())
      .get()
    const releaseDate = 'Not present'

    return {
      title,
      author,
      status,
      lastChapter,
      coverUrl,
      description,
      tags,
      releaseDate
    }
  } catch (error) {
    console.error('Failed to fetch MangaBat detail:', error)
    throw new Error('Failed to fetch detail')
  }
}
