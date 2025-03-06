import { Link, useNavigate } from "react-router-dom";
import { HomeContainer, MangaGrid, MangaCard } from "./styles";
import { useSearchStore } from "@renderer/Features/Store/Kakalot/useSearchStore";

const Home: React.FC = () => {
 
  const navigate = useNavigate();

  const { data, isFetching } = useSearchStore();

  if (isFetching) {
    return (
      <div>loading</div>
    )
  }

  if (!data) {  // Ensure data is always checked
    return <div>No mangas found</div>;
  }
  

  const handleClick = (link: string, title: string) => {
    const encodedLink = encodeURIComponent(link);
    const encodedTitle = encodeURIComponent(title);

    navigate(`/detail?link=${encodedLink}&title=${encodedTitle}`);
  };
 
  return (
    <HomeContainer>
      <h1>Welcome to the Home Page</h1>
      <MangaGrid>
      {Array.isArray(data) && data.length > 0 ? (
      data.map((manga) => (
        <MangaCard key={manga.id} onClick={() => handleClick(manga.href, manga.title)}>
          <h2>{manga.title}</h2>
          <Link to={`/detail?link=${encodeURIComponent(manga.href)}`}>{manga.href}</Link>
        </MangaCard>
      ))
    ) : (
      <div>No mangas found</div>
    )}
      </MangaGrid>
    </HomeContainer>
  );
};

export default Home;  