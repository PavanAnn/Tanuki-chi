import Store from 'electron-store'

// i think that i can use this interface for every provider
interface Bookmark {
  title: string
  link: string
  coverHref: string
  latestRead: string;
  provider: string;
}

const store: any = new Store<{ bookmarks: Bookmark[] }>({
  defaults: {
    bookmarks: []
  }
})

export const getBookmarks = (): Bookmark[] => store.get('bookmarks', [])

export const handleBookmark = (
  title: string,
  link: string,
  coverHref: string,
  provider: string,
  latestRead?: string,
): void => {
  const bookmarks = getBookmarks()
  const isBookmarked = bookmarks.some(
    (b) => b.title === title && b.link === link && b.provider === provider
  );
  
  if (isBookmarked) {
    store.set(
      'bookmarks',
      bookmarks.filter((b) => !(b.title === title && b.link === link && b.provider === provider))
    );
  } else {
    const newBookmark = {
      title,
      link,
      coverHref,
      provider,
      ...(latestRead && { latestRead })
    };
  
    store.set('bookmarks', [...bookmarks, newBookmark]);
  }
}

export const updateLatestRead = (
  title: string,
  link: string,
  latestRead: string | null
): void => {
  const bookmarks = getBookmarks()
  const updated = bookmarks.map((b) =>
    b.title === title && b.link === link
      ? { ...b, ...(latestRead ? { latestRead } : {}) }
      : b
  )

  store.set('bookmarks', updated)
}


export const clearBookmarks = () => {
  store.set('bookmarks', [])
}