import { useGetKakalot } from "@renderer/Features/Fetchers/Kakalot/Hooks";
import { HomeContainer, MangaGrid, MangaCard } from "./styles";

const mockMangaLibrary = [
  { id: 1, title: 'Manga 1', description: 'This is a description for Manga 1.' },
  { id: 2, title: 'Manga 2', description: 'This is a description for Manga 2.' },
  { id: 3, title: 'Manga 3', description: 'This is a description for Manga 3.' },
  { id: 4, title: 'Manga 4', description: 'This is a description for Manga 4.' },
  { id: 5, title: 'Manga 5', description: 'This is a description for Manga 5.' },
  { id: 6, title: 'Manga 6', description: 'This is a description for Manga 6.' },
];



const Home: React.FC = () => {

  const response = useGetKakalot('1');

  const { isLoading, data } = response;

  if (isLoading) {
    return (
      <>loading</>
    )
  }

  return (
    <HomeContainer>
      <h1>Welcome to the Home Page</h1>
      <MangaGrid>
        {mockMangaLibrary.map((manga) => (
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