import { useNavigate } from "react-router-dom";
import { HomeContainer, MangaGrid } from "./styles";
import { useSearchStore } from "@renderer/Features/Store/Kakalot/useSearchStore";
import { useEffect } from "react";
import { Card, Flex, Image, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const Home: React.FC = () => {
 
  const navigate = useNavigate();

  const { data, isFetching, setData } = useSearchStore();

  // re-think if its necessary to clean the previous data

  if (isFetching) {
    return (
      <Flex align="center" gap="middle">
        <Spin tip={<div>Fetching mangas</div>} fullscreen indicator={<LoadingOutlined spin />} size="large" />
      </Flex>
    )
  }  

  const handleClick = (link: string, title: string) => {
    const encodedLink = encodeURIComponent(link);
    const encodedTitle = encodeURIComponent(title);

    navigate(`/detail?link=${encodedLink}&title=${encodedTitle}`);
  };
 
  return (
    <HomeContainer>
      <MangaGrid>
      {Array.isArray(data) && data.length > 0 ? (
        <Flex vertical gap="large">
          <h1>Search results: </h1>
          <Flex gap={'large'} style={{ flexDirection: 'row' }} wrap>
            {data.map((manga) => (
              <Card size="small" title={manga.title} key={manga.id} onClick={() => handleClick(manga.href, manga.title)} style={{ width: '15%', cursor: 'pointer' }}>
                <Image preview={false} loading={'lazy'} src={manga.cover} />
              </Card>
            ))}
          </Flex></Flex>
    ) : (
      <div style={{ display	: 'flex', flexDirection: 'column' }}><h1>Welcome to the Home Page</h1><div>Search for mangas in the search bar on top</div></div>
    )}
      </MangaGrid>
    </HomeContainer>
  );
};

export default Home;  