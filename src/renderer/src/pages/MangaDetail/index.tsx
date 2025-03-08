import { useGetDetailMangasWeebCentral, useGetMangasPagesWeebCentral } from "@renderer/Features/Fetchers/WeebCentral/Hooks";
import { Drawer, Image } from "antd";
import { useState } from "react";
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

  const link = searchParams.get("link");
  const title = searchParams.get("title");

  const { data, isFetching } = useGetDetailMangasWeebCentral(link);
  const { data: allPages, isLoading } = useGetMangasPagesWeebCentral(selectedLink);
  if (isFetching) {
    return <div>loading</div>;
  }

  const showDrawer = (link: string, chapter: string) => {
    setSelectedChapter(chapter)
    setSelectedLink(link); // Set the selected link
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelectedLink(null); // Reset the selected link on close
  };

  const res: DetailManga = data?.response.data;
  const pages: Pages[] = allPages?.response.data.pages ?? [];

  return (
    <div>
      <h1>{title ?? "oi"}</h1>
      <p>{res.author}</p>
      <p>{res.status}</p>
      <p>{res.latestChapter}</p>
      {res.chapters.map((element) => (
        <p key={element.href} onClick={() => showDrawer(element.href, element.text)}>
          {element.text}
        </p>
      ))}
      <Drawer width={"90%"} title={selectedChapter} onClose={onClose} open={open} loading={isLoading}>
        {pages.map((element) => (
          <Image width={'50%'} src={element.href} />
        ))}
      </Drawer>
    </div>
  );
};
