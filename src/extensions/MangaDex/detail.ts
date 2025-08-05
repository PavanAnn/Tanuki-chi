// src/extensions/mangadex.ts

import axios from "axios";
import { DetailType } from "../types";

const baseUrl = 'https://api.mangadex.org';
const coverBaseUrl = 'https://uploads.mangadex.org/covers';

export async function getMangaDexDetails(mangaId: string): Promise<DetailType> {
  try {
    const response = await axios.get(`${baseUrl}/manga/${mangaId}`, {
      params: {
        includes: ['author', 'cover_art'],
      },
    });

    const manga = response.data.data;
    const attributes = manga.attributes;

    const title =
      attributes.title?.en ||
      Object.values(attributes.title || {})[0] ||
      'Unknown Title';

    const description =
      attributes.description?.en ||
      Object.values(attributes.description || {})[0] ||
      'No description available.';

    const tags = attributes.tags?.map((tag: any) => tag.attributes?.name?.en || '') || [];

    const authorRelationship = manga.relationships?.find(
      (rel: any) => rel.type === 'author'
    );
    const authorName = authorRelationship?.attributes?.name || 'Unknown Author';

    const coverRelationship = manga.relationships?.find(
      (rel: any) => rel.type === 'cover_art'
    );
    const coverFileName = coverRelationship?.attributes?.fileName;
    const coverUrl = coverFileName
      ? `${coverBaseUrl}/${manga.id}/${coverFileName}`
      : undefined;

    return {
      contentRating: attributes.contentRating,
      description,
      lastChapter: attributes.lastChapter || '',
      lastVolume: attributes.lastVolume,
      status: attributes.status,
      title,
      lastUpdate: attributes.updatedAt,
      releaseDate: attributes.year ? attributes.year.toString() : undefined,
      type: attributes.publicationDemographic,
      tags,
      author: authorName,
      coverUrl,
    };
  } catch (error) {
    console.error('Error fetching MangaDex details:', error);
    throw error;
  }
}
