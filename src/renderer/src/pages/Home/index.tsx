import { HomeContainer, MangaGrid, MangaCard } from "./styles";
import { useSearchStore } from "@renderer/Features/Store/Kakalot/useSearchStore";

const Home: React.FC = () => {
 

  const { data, isFetching } = useSearchStore();

  if (isFetching) {
    return (
      <div>loading</div>
    )
  }

  if (data === null) {
    return (
      <div>no managas</div>
    )
  }

  return (
    <HomeContainer>
      <h1>Welcome to the Home Page</h1>
      <MangaGrid>
        {data.map((manga) => (
          <MangaCard key={manga.id} onClick={() => {console.log(data)}}>
            <h2>{manga.title}</h2>
            <p>{manga.description}</p>
          </MangaCard>
        ))}
      </MangaGrid>
    </HomeContainer>
  );
};

export default Home; 