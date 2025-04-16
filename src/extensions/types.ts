export interface SearchType {
  id: string;
  title: string;
  coverUrl?: string;
}
  
export interface DetailType {
    contentRating?: string;
    description: string;
    lastChapter: string;
    lastVolume?: string;
    status: string;
    title: string;
    lastUpdate?: string;
    releaseDate?: string;
    type?: string;
    tags: string[];
    author: string;
    coverUrl?: string;
}
  
