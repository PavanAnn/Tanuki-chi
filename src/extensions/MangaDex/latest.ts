import axios from "axios";

const baseUrl = 'https://api.mangadex.org';

export async function getLatestMangaDex(mangaId: string) {
  try {
    console.log('Fetching latest chapter from MangaDex...')
    const response = await axios.get(`${baseUrl}/manga/${mangaId}/feed`, {
      params: {
        translatedLanguage: ['en'],
        limit: 1,
        includeFuturePublishAt: 0,
        order: {
          chapter: 'desc',
        },
      },
    });

    const chapters = response.data.data;
    const latestChapter = chapters[0]?.attributes.chapter || '';

    return {
      lastChapter: latestChapter,
    };
  } catch (error) {
    console.error('Error fetching MangaDex latest chapter:', error);
    throw error;
  }
}
