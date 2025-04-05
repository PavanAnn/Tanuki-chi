const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

app.get('/api/mangas', async (req, res) => {
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

    // Check if we should stop by comparing the first title of the current page with the last title of allMangas
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

app.get('/api/mangas/search', async (req, res) => {
  let allMangas = []
  let page = 1

  const { search } = req.query

  console.log(search)

  while (true) {
    try {
      const response = await axios.get(
        `https://mangakakalot.com/search/story/${search}?page=${page}`
      )
      const html = response.data
      const $ = cheerio.load(html)

      const lastPageLink = $('.panel_page_number .group_page a.page_last').attr('href')
      const totalPages = lastPageLink ? parseInt(lastPageLink.match(/page=(\d+)/)[1], 10) : 1

      const mangas = []
      $('.story_item_right').each((_, element) => {
        const title = $(element).find('h3.story_name a').text().trim() // Get the title text
        const link = $(element).find('h3.story_name a').attr('href') // Get the href attribute
        if (title && link) {
          mangas.push({ title, link })
          console.log(page, title)
        }
      })

      // Check if we should stop by comparing the first title of the current page with the last title of allMangas
      if (mangas.length > 0 && allMangas.length > 0 && page == totalPages) {
        console.log('Reached last page')
        break // Stop the loop if the titles match
      }

      if (mangas.length === 0) {
        console.log('No mangas found on page')
        break // Stop if no mangas are found (end of pages)
      }

      allMangas = allMangas.concat(mangas)
      page++
    } catch (error) {
      console.error(`Error on page ${page}:`, error.message)
      res.status(500).json({ error: 'Failed to fetch all pages' })
      return
    }
  }

  res.json(allMangas)
})

app.get('/api/mangas/detail', async (req, res) => {
  const { search } = req.query
  console.log('search -> ', search)

  // Object to store cookies manually
  let cookies = ''

  try {
    // First request to get the cookies and page content
    const response = await axios.get(search, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive'
      }
    })

    // Extract the cookies from the response headers
    const setCookie = response.headers['set-cookie']
    if (setCookie) {
      // Combine cookies into a single string
      cookies = setCookie.map((cookie) => cookie.split(';')[0]).join('; ')
    }

    // Make another request with the cookies set in the header
    const nextResponse = await axios.get(search, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        Cookie: cookies // Send the cookies manually
      }
    })

    const html = nextResponse.data
    const $ = cheerio.load(html)

    const mangaInfo = $('ul.manga-info-text')
    const mangaDetails = []

    mangaInfo.find('li').each((index, element) => {
      const text = $(element).text().trim()
      if ($(element).hasClass('genres')) {
        const genres = []
        $(element)
          .find('a')
          .each((_, aElement) => {
            genres.push($(aElement).text().trim())
          })
        mangaDetails.push({ genres })
      } else {
        mangaDetails.push({ text })
      }
    })

    res.json(mangaDetails)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch detail' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
