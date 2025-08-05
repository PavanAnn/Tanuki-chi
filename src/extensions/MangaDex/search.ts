// src/extensions/mangadex.ts
import axios from 'axios';
import { SearchType } from '../types';

const baseUrl = 'https://api.mangadex.org';
const coverBaseUrl = 'https://uploads.mangadex.org/covers';

export async function searchMangadex(title: string): Promise<SearchType[]> {
  try {
    const response = await axios.get(`${baseUrl}/manga`, {
      params: {
        title,
        includes: ['cover_art'],
      },
    });

    const mangas = response.data.data;

    return mangas.map((manga: any) => {
      const attributes = manga.attributes;

      const extractedTitle =
        attributes.title?.en ||
        Object.values(attributes.title || {})[0] ||
        'Unknown Title';

      const coverRelationship = manga.relationships?.find(
        (rel: any) => rel.type === 'cover_art'
      );
      const coverFileName = coverRelationship?.attributes?.fileName;
      const coverUrl = coverFileName
        ? `${coverBaseUrl}/${manga.id}/${coverFileName}`
        : undefined;

      return {
        id: manga.id,
        title: extractedTitle,
        coverUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching MangaDex search results:', error);
    throw error;
  }
}
