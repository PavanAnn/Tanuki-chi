export const extractChapterNumber = (chapter: string): number => {
  const match = chapter?.match(/\d+(\.\d+)?/)
  return match ? parseFloat(match[0]) : 0
}

export const getUnreadChapters = (latestRead: string, latestChapter: string): number => {
  const read = extractChapterNumber(latestRead)
  const latest = extractChapterNumber(latestChapter)
  const diff = latest - read
  return diff > 0 ? Math.ceil(diff) : 0
}

export interface Bookmark {
  title: string;
  link: string;
  cover: string;
  provider: string;
  latestRead?: string;
  createdAt: string;
  latestChapter: string;
}

export function mapBookmark(item: any): Bookmark {
  return {
    title: item.title,
    link: item.link,
    cover: item.coverHref,
    provider: item.provider,
    latestRead: item.latestRead,
    createdAt: item.createdAt,
    latestChapter: item.latestChapter,
  };
}

export function sortBookmarks(items: Bookmark[], sortType: string): Bookmark[] {
  return [...items].sort((a, b) => {
    if (sortType === 'title') {
      return a.title.localeCompare(b.title, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    }
    if (sortType === 'createdAt') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortType === 'unread') {
      const aUnread = getUnreadChapters(a.latestRead || '', a.latestChapter);
      const bUnread = getUnreadChapters(b.latestRead || '', b.latestChapter);
      if (aUnread === 0 && bUnread > 0) return 1;
      if (aUnread > 0 && bUnread === 0) return -1;
      return aUnread - bUnread;
    }
    return 0;
  });
}
