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
  coverUrl: string
}

export interface PageType {
  href: string
  text: string
  data?: string
}

export interface UpdateNotification {
  title: string
  link: string
  provider: string
  newChapter: string
  date: string
}

export interface BookmarkType {
  title: string
  link: string
  coverHref: string
  latestRead?: string
  provider: string
  createdAt: string
  updatedAt: string
  latestChapter: string
}

export type BookmarkCardProps = {
  data: BookmarkType
  updating: boolean
  onNavigate: (provider: string, link: string, title: string) => void
  onDelete: (e: React.MouseEvent, item: BookmarkType) => void
}

// export interface ChapterType
