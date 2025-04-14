// WeebCentral.js
import express from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'

const router = express.Router() // Use Router to define routes

// https://weebcentral.com/search/data?author=&text=naruto&sort=Best%20Match&order=Ascending&official=Any&anime=Any&adult=Any&display_mode=Full%20Display

// Route for fetching mangas
/* router.get('/mangas', async (req, res) => {
  let allMangas = []
  const { page = 1 } = req.query
  console.log('page', page)

  try {
    const response = await axios.get(
      `https://mangakakalot.com/manga_list?type=new&category=all&alpha=all&state=all&group=all&page=${page}`
    )
    const html = response.data
    const $ = cheerio.load(html)

    const mangas = []
    $('.list-truyen-item-wrap').each((_, element) => {
      const title = $(element).find('h3 a').attr('title')
      const link = $(element).find('h3 a').attr('href')
      if (title && link) {
        mangas.push({ title, link })
        console.log(page, title)
      }
    })

    if (
      mangas.length > 0 &&
      allMangas.length > 0 &&
      allMangas[allMangas.length - 1].title === mangas[mangas.length - 1].title
    ) {
      console.log('Reached last page')
    }

    if (mangas.length === 0) {
      console.log('No mangas found on page')
    }

    allMangas = allMangas.concat(mangas)
  } catch (error) {
    console.error(`Error on page ${page}:`, error.message)
    res.status(500).json({ error: 'Failed to fetch all pages' })
    return
  }

  res.json(allMangas)
})
*/

// Route for searching mangas
router.get('/mangas/search', async (req, res) => {
  let allMangas = []
  let offset = 0
  const { search } = req.query

  if (!search) {
    return res.status(400).json({ error: 'Search term is required.' })
  }

  let previousMangas = []
  let currentMangas = []

  try {
    while (true) {
      const response = await axios.get(
        `https://fanfox.net/search?title=${encodeURIComponent(search)}&page=${offset}`
      )

      const html = response.data
      const $ = cheerio.load(html)

      currentMangas = []
      // search-results
      $('ul.manga-list-4-list.line > li').each((index, element) => {
        const el = $(element)

        const linkEl = el.find('a').first()
        const href = 'https://fanfox.net' + linkEl.attr('href')
        const title = linkEl.attr('title')
        const cover = el.find('img.manga-list-4-cover').attr('src')

        currentMangas.push({
          title,
          href,
          cover
        })
      })
      if (currentMangas.length === 0) {
        break
      }

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

    res.json(allMangas)
  } catch (error) {
    console.error('Error fetching data:', error.message)
    res.status(500).json({ error: 'Failed to fetch search results' })
  }
})

// Route for manga detail -> to-do Remove the unnecessary headers and set-cookie response
router.get('/mangas/detail', async (req, res) => {
  const { search } = req.query

  try {
    const response = await axios.get(search, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      }
    })

    const $ = cheerio.load(response.data)

    const author = $('.detail-info-right-say').text().replace('Author:', '').trim()

    const status = $('.detail-info-right-title-tip').text().trim()

    const coverHref = $('.detail-info-cover-img').attr('src')

    const chapters = []

    $('#chapterlist ul.detail-main-list li').each((index, element) => {
      const anchor = $(element).find('a')
      const href = anchor.attr('href')
      const text = anchor.find('.title3').text().trim()
      const date = anchor.find('.title2').text().trim()

      if (href && text) {
        chapters.push({ text, href: `https://fanfox.net/${href}`, date })
      }
    })

    const latestChapter = chapters.length > 0 ? chapters[0].title : null

    res.json({
      author,
      status,
      latestChapter,
      chapters,
      coverHref
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch detail' })
  }
})

router.get('/mangas/pages', async (req, res) => {
  const { search } = req.query

  try {
    // https://fanfox.net/manga/naruto/v72/c699/1.html
    const response = await axios.get(
      `${search}/images?is_prev=False&current_page=1&reading_style=long_strip`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
        }
      }
    )
    const pages = []

    let html = response.data
    let $ = cheerio.load(html)

    // Scrap all pages and its href
    $('img').each((index, element) => {
      const text = $(element).attr('alt')
      const href = $(element).attr('src')

      if (text) {
        pages.push({ text, href: `https://fanfox.net/${href}` })
      }
    })

    res.json({ pages })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pages' })
  }
})

// proxy inside a proxy so cloudfront wont fuck me up
router.get('/mangas/image-proxy', async (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Missing image URL' })
  }

  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        Referer: 'https://fanfox.net//',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Sec-CH-UA': `"Not/A)Brand";v="8", "Chromium";v="126"`,
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': `"Windows"`
      }
    })
    res.set('Content-Type', response.headers['content-type'])
    res.send(response.data)
  } catch (error) {
    console.error('Image proxy error:', error.message)
    res.status(500).json({ error: 'Failed to fetch image' })
  }
})

export default router
