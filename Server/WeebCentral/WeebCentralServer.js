// WeebCentral.js
const express = require('express');
const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();  // Use Router to define routes

// https://weebcentral.com/search/data?author=&text=naruto&sort=Best%20Match&order=Ascending&official=Any&anime=Any&adult=Any&display_mode=Full%20Display


// Route for fetching mangas
router.get('/mangas', async (req, res) => {
    let allMangas = [];
    const { page = 1 } = req.query;
    console.log('page', page);

    try {
        const response = await axios.get(
            `https://mangakakalot.com/manga_list?type=new&category=all&alpha=all&state=all&group=all&page=${page}`
        );
        const html = response.data;
        const $ = cheerio.load(html);

        const mangas = [];
        $('.list-truyen-item-wrap').each((_, element) => {
            const title = $(element).find('h3 a').attr('title');
            const link = $(element).find('h3 a').attr('href');
            if (title && link) {
                mangas.push({ title, link });
                console.log(page, title);
            }
        });

        // Check for last page
        if (mangas.length > 0 && allMangas.length > 0 && allMangas[allMangas.length - 1].title === mangas[mangas.length - 1].title) {
            console.log('Reached last page');
        }

        if (mangas.length === 0) {
            console.log('No mangas found on page');
        }

        allMangas = allMangas.concat(mangas);
    } catch (error) {
        console.error(`Error on page ${page}:`, error.message);
        res.status(500).json({ error: 'Failed to fetch all pages' });
        return;
    }

    res.json(allMangas);
});

// Route for searching mangas
router.get('/mangas/search', async (req, res) => {
    let allMangas = [];
    let offset = 0;  // Starting from the first item
    const { search } = req.query;  // The search term provided by the user
    console.log('Search Term:', search);

    // Check if the user has provided a search term
    if (!search) {
        return res.status(400).json({ error: 'Search term is required.' });
    }

    let previousMangas = [];
    let currentMangas = [];

    try {
        while (true) {
            const response = await axios.get(
                `https://weebcentral.com/search/data?text=${encodeURIComponent(search)}&sort=Best%20Match&order=Ascending&display_mode=Full%20Display&offset=${offset}&limit=32`
            );

            const html = response.data;
            const $ = cheerio.load(html);



            currentMangas = [];
            $('abbr.no-underline').each((index, element) => {
                const link = $(element).find('a.link-hover'); // Find <a> inside <abbr>
                const href = link.attr('href'); // Extract the href attribute
                const title = link.text();
            
                // Check if both title and link are available
                if (title && href) {
                    currentMangas.push({ title, href });
                }
            });
            
            // If no new mangas are found, we are done
            if (currentMangas.length === 0) {
                console.log('No mangas found on page');
                break;
            }

            // Check if we've reached the last page
            if (previousMangas.length > 0 && previousMangas[0].title === currentMangas[currentMangas.length - 1].title) {
                console.log('Reached last page');
                break;
            }

            // Add current page to the list of all mangas
            allMangas = allMangas.concat(currentMangas);

            // Move to the next page by incrementing the offset by 32
            offset += 32;

            // Set the previous page's mangas for comparison in the next loop
            previousMangas = currentMangas;
        }

        // Return all the fetched mangas
        res.json(allMangas);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
});

// Route for manga detail -> to-do Remove the unnecessary headers and set-cookie response
    router.get('/mangas/detail', async (req, res) => {
        const { search } = req.query;

        let cookies = '';

        try {
            const response = await axios.get(search, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                }
            })
        
            const fullChapterListUrl = search.replace(/\/[^\/]+$/, '/full-chapter-list')

            // Get the doc with all the chapters
            const responseAllMangas = await axios.get(fullChapterListUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                }
            });

            let html = response.data;
            let $ = cheerio.load(html);

            const author = $('li:has(strong:contains("Author(s):")) a').text().trim();

            const status = $('li:has(strong:contains("Status:")) a').text().trim();
            const chapters = [];
            const latestChapter = $('#chapter-list .flex a').first().find('span').eq(1).find('span').eq(0).text();

            html = responseAllMangas.data;
            $ = cheerio.load(html);

            // Scrap all chapters and its href
            $('div.flex.items-center').each((index, element) => {
                const text = $(element).find('a').find('span').eq(1).find('span').eq(0).text().trim();
                const href = $(element).find('a').attr('href');

                if (text) {
                    chapters.push({text, href});
                }
                });
            

            res.json({ author, status, latestChapter, chapters });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Failed to fetch detail' });
        }
    });

    router.get('/mangas/pages', async (req, res) => {
        const { search } = req.query;


        try {
            const response = await axios.get(`${search}/images?is_prev=False&current_page=1&reading_style=long_strip`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                }
            })
            const pages = [];

            let html = response.data;
            let $ = cheerio.load(html);


            // Scrap all pages and its href
            $('img').each((index, element) => {
                const text = $(element).attr('alt')
                const href = $(element).attr('src');

                if (text) {
                    pages.push({text, href});
                }
                });
            

            res.json({ pages });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch pages' });
        }
    });


module.exports = router;  // Export the router
