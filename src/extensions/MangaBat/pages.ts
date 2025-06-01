import axios from 'axios'
import * as cheerio from 'cheerio'
import { imageProxyMangaBat } from './imageProxy';

export async function getPages(search: string): Promise<
  { text: string; data: string; contentType: string }[]
> {
  try {
    const headers = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
    }

    const response = await axios.get(search, { headers })
    const $ = cheerio.load(response.data)

    const pages: { text: string; data: string; contentType: string }[] = []

    const images = $('.container-chapter-reader img')

    for (let i = 0; i < images.length; i++) {
      const element = images[i]
      const src = $(element).attr('src')?.trim()
      const alt = $(element).attr('alt')?.trim() ?? ''
      console.log('Src', src)

      if (src) {
        try {
          const { data, contentType } = await imageProxyMangaBat(src)
          pages.push({ text: alt, data, contentType })
        } catch (err) {
          console.warn(`Failed to proxy image: ${src}`)
        }
      }
    }
    return pages
  } catch (error) {
    console.error('Failed to fetch WeebCentral pages:', error)
    throw new Error('Failed to fetch pages')
  }
}
