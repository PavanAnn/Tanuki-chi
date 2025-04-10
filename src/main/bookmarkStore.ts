import Store from 'electron-store'

// i think that i can use this interface for every provider
interface Bookmark {
  title: string
  link: string
  coverHref: string
  latestRead?: string
  provider: string
  createdAt: string
  updatedAt: string
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
  latestRead?: string
): void => {
  const now = new Date().toISOString()
  const bookmarks = getBookmarks()

  const existing = bookmarks.find(
    (b) => b.title === title && b.link === link && b.provider === provider
  )

  if (existing) {
    store.set(
      'bookmarks',
      bookmarks.filter((b) => !(b.title === title && b.link === link && b.provider === provider))
    )
  } else {
    const newBookmark: Bookmark = {
      title,
      link,
      coverHref,
      provider,
      createdAt: now,
      updatedAt: now,
      ...(latestRead && { latestRead })
    }

    store.set('bookmarks', [...bookmarks, newBookmark])
  }
}

export const updateLatestRead = (title: string, link: string, latestRead: string | null): void => {
  const now = new Date().toISOString()
  const bookmarks = getBookmarks()

  const updated = bookmarks.map((b) =>
    b.title === title && b.link === link
      ? {
          ...b,
          ...(latestRead ? { latestRead } : {}),
          updatedAt: now
        }
      : b
  )

  store.set('bookmarks', updated)
}

export const clearBookmarks = () => {
  store.set('bookmarks', [])
}
