import Store from "electron-store";

interface Bookmark {
  title: string;
  link: string;
  coverHref: string
}

const store: any = new Store<{ bookmarks: Bookmark[] }>({
  defaults: {
    bookmarks: [],
  },
});

export const getBookmarks = (): Bookmark[] => store.get("bookmarks", []);

export const handleBookmark = (title: string, link: string, coverHref: string): void => {
  const bookmarks = getBookmarks();
  const isBookmarked = bookmarks.some((b) => b.title === title && b.link === link);

  if (isBookmarked) {
    store.set("bookmarks", bookmarks.filter((b) => !(b.title === title && b.link === link)));
  } else {
    store.set("bookmarks", [...bookmarks, { title, link, coverHref }]);
  }
};
