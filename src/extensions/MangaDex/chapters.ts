import axios from 'axios';

export async function getChapters(mangaId: string) {
  const chapters: any[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await axios.get('https://api.mangadex.org/manga/' + mangaId + '/feed', {
      params: {
        translatedLanguage: ['en'],
        limit,
        offset,
        includeFuturePublishAt: 0,
        order: {
          chapter: 'desc',
        },
      },
    });

    const data = response.data;
    chapters.push(...data.data);

    offset += data.data.length;
    hasMore = data.total > offset;
  }

  return chapters;
}
