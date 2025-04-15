import axios from 'axios';

const baseUrl = 'https://api.mangadex.org';

export interface MangaDexSearchResult {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
}

export default async function search(
  title: string
): Promise<MangaDexSearchResult[]> {
  try {
    const resp = await axios.get(`${baseUrl}/manga`, {
      params: {
        title,
        limit: 20,
        includes: ['cover_art', 'author', 'artist']
      }
    });

    const results = resp.data?.data ?? [];

    return results.map((item: any): MangaDexSearchResult => {
      const id = item.id;
      const attributes = item.attributes;
      const title = attributes.title?.en ?? 'No Title';
      const description = attributes.description?.en ?? '';

      const coverRel = item.relationships.find((rel: any) => rel.type === 'cover_art');
      const coverUrl = coverRel
        ? `https://uploads.mangadex.org/covers/${id}/${coverRel.attributes.fileName}.256.jpg`
        : undefined;

      return {
        id,
        title,
        description,
        coverUrl
      };
    });
  } catch (error) {
    console.error(`Failed to search MangaDex: ${error}`);
    return [];
  }
}
