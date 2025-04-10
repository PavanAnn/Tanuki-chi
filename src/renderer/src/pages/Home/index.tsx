import { useNavigate } from 'react-router-dom'
import { HomeContainer, MangaGrid } from './styles'
import { useSearchStore } from '../../Features/Store/Search/useSearchStore'
import { Card, Flex, Image, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { data, isFetching } = useSearchStore()

  const handleClick = (provider: string, link: string, title: string) => {
    const encodedLink = encodeURIComponent(link)
    const encodedTitle = encodeURIComponent(title)
    const encodedProvider = encodeURIComponent(provider)

    navigate(`/detail?provider=${encodedProvider}&link=${encodedLink}&title=${encodedTitle}`)
  }

  if (isFetching) {
    return (
      <Flex align="center" gap="middle">
        <Spin
          tip={<div>Fetching mangas</div>}
          fullscreen
          indicator={<LoadingOutlined spin />}
          size="large"
        />
      </Flex>
    )
  }

  return (
    <HomeContainer>
      <MangaGrid>
        {Array.isArray(data) && data.length > 0 ? (
          <Flex vertical gap="large">
            <h1>Search results grouped by providers:</h1>

            {data.map((providerEntry) => {
              const providerName = Object.keys(providerEntry)[0]
              const mangas = providerEntry[providerName]

              return (
                <div key={providerName}>
                  <h2 style={{ textTransform: 'capitalize' }}>{providerName}</h2>
                  <Flex gap="large" wrap style={{ marginBottom: 32 }}>
                    {mangas.map((manga: any) => (
                      <Card
                        size="small"
                        key={manga.id || manga.href}
                        title={manga.title}
                        onClick={() => handleClick(providerName, manga.href, manga.title)}
                        style={{ width: '15%', cursor: 'pointer' }}
                      >
                        <Image
                          preview={false}
                          loading="lazy"
                          src={`http://127.0.0.1:3000/api/${providerName}/mangas/image-proxy?url=${encodeURIComponent(
                            manga.cover
                          )}`}
                          fallback="/fallback.jpg"
                        />
                      </Card>
                    ))}
                  </Flex>
                </div>
              )
            })}
          </Flex>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>Welcome to the Home Page</h1>
            <div>Search for mangas in the search bar on top</div>
          </div>
        )}
      </MangaGrid>
    </HomeContainer>
  )
}

export default Home
