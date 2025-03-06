import { useGetDetailMangasWeebCentral } from "@renderer/Features/Fetchers/WeebCentral/Hooks";
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

export const MangaDetail = () => {
  const [searchParams] = useSearchParams();
  const link = searchParams.get("link");
  const title = searchParams.get("title");
  
  const { data, isFetching } = useGetDetailMangasWeebCentral(link);

  if (isFetching) {
    return <div>loading</div>
  }

  const res: DetailManga = data?.response.data;
  
  return (
    <div>
      <h1>{title ?? 'oi'}</h1>
      <p>{res.author}</p>
      <p>{res.status}</p>
      <p>{res.latestChapter}</p>
      {res.chapters.map((element) => (
        <p>{element.text}</p>
      ))}

    </div>
  );
};
