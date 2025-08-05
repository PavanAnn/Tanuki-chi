import axios from 'axios';
import { SearchType } from '../types';

interface AllTitlesGroup {
  theTitle: string;
  titles: Array<{
    titleId: number;
    title: string;
    thumbnailPortrait: string;
    // …other fields if you need them
  }>;
}

interface AllTitlesViewV2 {
  allTitlesGroup: AllTitlesGroup[];
}

export async function searchMangaPlus(searchTerm: string): Promise<SearchType[]> {
  if (!searchTerm) {
    throw new Error('Search term is required.');
  }

  try {
    const { data } = await axios.get<AllTitlesViewV2>(
      'https://jumpg-webapi.tokyo-cdn.com/api/title_list/allV2',
      {
        params: {
          lang: 'eng',
          clang: 'eng',
        },
        // no need for arraybuffer, V2 returns JSON
      }
    );

    // flatten all groups into one array of titles
    const allTitles = data.allTitlesGroup
      .flatMap((group) => group.titles);

    // filter by search term and map into your SearchType
    return allTitles
      .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((t) => ({
        id: `https://mangaplus.shueisha.co.jp/titles/${t.titleId}`,
        title: t.title,
        coverUrl: t.thumbnailPortrait,
      }));
  } catch (err: any) {
    console.error('MangaPlus V2 search error:', err.message);
    throw new Error('Failed to fetch MangaPlus search results.');
  }
}
