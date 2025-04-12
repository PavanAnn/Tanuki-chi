export const mapBookmarks = (savedBookmarks: any[]): Bookmark[] => {
    return savedBookmarks.map((item) => ({
      title: item.title,
      link: item.link,
      cover: item.coverHref,
      provider: item.provider,
      latestRead: item.latestRead,
      createdAt: item.createdAt,
      latestChapter: item.latestChapter,
    }))
}
  
  // Optionally define the Bookmark type if not already
export interface Bookmark {
    title: string
    link: string
    cover: string
    provider: string
    latestRead: string | null
    latestChapter: string | null
    createdAt: string
}
  