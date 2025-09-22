import axios from 'axios'
import { ChapterType } from '../types'

export async function getChapters(mangaId: string): Promise<ChapterType[]> {
  const chapters: any[] = []
  let offset = 0
  const limit = 100
  let hasMore = true

  while (hasMore) {
    const response = await axios.get('https://api.mangadex.org/manga/' + mangaId + '/feed', {
      params: {
        translatedLanguage: ['en'],
        limit,
        offset,
        includeFuturePublishAt: 0,
        order: {
          chapter: 'desc'
        }
      }
    })

    const data = response.data
    chapters.push(
      ...data.data.map((item: any) => ({
        ...item,
        attributes: {
          ...item.attributes,
          releaseDate: item.attributes.publishAt
        }
      }))
    )

    offset += data.data.length
    hasMore = data.total > offset
  }

  return chapters
}
