const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/api/mangas', async (req, res) => {
    let allMangas = [];
    const { page = 1 } = req.query;

    console.log('page', page)

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
                    console.log(page, title)
                }
            });

            // Check if we should stop by comparing the first title of the current page with the last title of allMangas
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

app.get('/api/mangas/search', async (req, res) => {
    let allMangas = [];
    let page = 1;

    const { search } = req.query;

    console.log(search)

    while (true) {
        try {
            const response = await axios.get(
                `https://mangakakalot.com/search/story/${search}?page=${page}`
            );
            const html = response.data;
            const $ = cheerio.load(html);

            const lastPageLink = $('.panel_page_number .group_page a.page_last').attr('href');
            const totalPages = lastPageLink ? parseInt(lastPageLink.match(/page=(\d+)/)[1], 10) : 1;
    

            const mangas = [];
            $('.story_item_right').each((_, element) => {
                const title = $(element).find('h3.story_name a').text().trim(); // Get the title text
                const link = $(element).find('h3.story_name a').attr('href'); // Get the href attribute
                if (title && link) {
                    mangas.push({ title, link });
                    console.log(page, title)
                }
            });

            // Check if we should stop by comparing the first title of the current page with the last title of allMangas
            if (mangas.length > 0 && allMangas.length > 0 && page == totalPages) {
                console.log('Reached last page');
                break; // Stop the loop if the titles match
            }

            if (mangas.length === 0) {
                console.log('No mangas found on page');
                break; // Stop if no mangas are found (end of pages)
            }

            allMangas = allMangas.concat(mangas);
            page++;
        } catch (error) {
            console.error(`Error on page ${page}:`, error.message);
            res.status(500).json({ error: 'Failed to fetch all pages' });
            return;
        }
    }

    res.json(allMangas);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

