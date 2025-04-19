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
    coverUrl: string;
}

export interface PageType {
  href: string;
  text: string;
}

export interface UpdateNotification {
  title: string
  link: string
  provider: string
  newChapter: string
  date: string
}


// export interface ChapterType