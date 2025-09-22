export interface SearchType {
  id: string
  title: string
  coverUrl?: string
}

export interface DetailType {
  contentRating?: string
  description: string
  lastChapter: string
  lastVolume?: string
  status: string
  title: string
  lastUpdate?: string
  releaseDate?: string
  type?: string
  tags: string[]
  author: string
  coverUrl?: string
}

export interface ChapterType {
  id: string
  attributes: {
    chapter: string
    title?: string
    releaseDate: string
  }
}

export type ExtensionMetadata = {
  id: string
  version: string
  name: string
  url: string
  proxy: boolean
}

export interface Extension {
  meta: ExtensionMetadata
  search: (searchTerm: string) => Promise<SearchType[]>
  detail: (url: string) => Promise<DetailType>
  chapters: (chapterUrl: string) => Promise<string[]>
  pages: (url: string) => Promise<string[]>
  latest?: (url: string) => Promise<any>
  proxy?: (url: string) => Promise<{ type: string; data: string }>
}
