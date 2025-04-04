import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useGetDetailMangasWeebCentral, useGetMangasPagesWeebCentral } from "@renderer/Features/Fetchers/WeebCentral/Hooks";
import { Drawer, Image } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Chapters {
  text: string;
  href: string;
}

interface DetailManga {
  author: string;
  status: string;
  latestChapter: string;
  chapters: Chapters[];
}

interface Pages {
  text: string;
  href: string;
}

export const MangaDetail = () => {
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  const link = searchParams.get("link");
  const title = searchParams.get("title");

  const { data, isFetching } = useGetDetailMangasWeebCentral(link);
  const { data: allPages, isLoading } = useGetMangasPagesWeebCentral(selectedLink);

  // Check if the current manga is bookmarked when title or link change
  useEffect(() => {
    const checkBookmark = async () => {
      if (title && link) {
        const bookmarks = await window.api.getBookmarks();
        const isBookmarked = bookmarks.some(
          (b) => b.title === title && b.link === link
        );
        setBookmarked(isBookmarked);
      }
    };
    checkBookmark();
  }, [title, link]);

  if (isFetching) {
    return <div>loading</div>;
  }

  const showDrawer = (link: string, chapter: string) => {
    setSelectedChapter(chapter);
    setSelectedLink(link);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedLink(null);
  };

  const res: DetailManga = data?.response.data;
  const pages: Pages[] = allPages?.response.data.pages ?? [];

  // Toggle bookmark state on click
  const handleBookmarkClick = async () => {
    if (title && link) {
      const updatedBookmarks = await window.api.toggleBookmark(title, link);
      // After toggling, update the bookmarked state based on whether the manga exists in the bookmarks
      const isBookmarked = updatedBookmarks.some(
        (b) => b.title === title && b.link === link
      );
      setBookmarked(isBookmarked);
    }
  };

  return (
    <div onClick={() => {console.log(data)}}>
      <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
        <h1>{title ?? "oi"}</h1>
        {bookmarked ? (
          <StarFilled
            onClick={handleBookmarkClick}
            style={{ fontSize: "22px", color: "#FFFF00" }}
          />
        ) : (
          <StarOutlined
            onClick={handleBookmarkClick}
            style={{ fontSize: "22px", color: "#FFFFFF" }}
          />
        )}
      </div>

      <p>{res.author}</p>
      <p>{res.status}</p>
      <p>Latest: {res.latestChapter}</p>
      -------------------
      {res.chapters.map((element) => (
        <p key={element.href} onClick={() => showDrawer(element.href, element.text)}>
          {element.text}
        </p>
      ))}
      <Drawer
        width={"92%"}
        extra={<div>uwu</div>}
        title={title + "  -  " + selectedChapter}
        onClose={onClose}
        open={open}
        loading={isLoading}
        styles={{
          body: { alignItems: "center", display: "flex", flexDirection: "column" },
        }}
        onKeyDown={() => console.log("aaaaaaaaaaa")}
      >
        {pages.map((element) => (
          <Image
            key={element.href}
            width={"55%"}
            src={`http://localhost:3000/api/weebcentral/mangas/image-proxy?url=${encodeURIComponent(
              element.href
            )}`}
            preview={{ minScale: 1000, movable: false }}
          />
        ))}
      </Drawer>
    </div>
  );
};
