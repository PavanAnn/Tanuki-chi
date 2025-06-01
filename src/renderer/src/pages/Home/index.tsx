import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeContainer, MangaGrid } from './styles'
import { useSearchStore } from '../../Features/Store/Search/useSearchStore'
import { Card, Flex, Image, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { SearchType } from '@renderer/types'
import { fetchProxiedImages, requiresProxy } from './proxyUtils'

type ImageMap = Record<string, string>

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { data, isFetching } = useSearchStore()
  const [proxiedImages, setProxiedImages] = useState<ImageMap>({})

  useEffect(() => {
    if (!Array.isArray(data)) return

    fetchProxiedImages(data, proxiedImages).then(newEntries => {
      if (Object.keys(newEntries).length > 0) {
        setProxiedImages(prev => ({ ...prev, ...newEntries }))
      }
    })
  }, [data])

  const handleClick = (provider: string, mangaId: string, title: string) => {
    navigate('/detail', {
      state: { provider, id: mangaId, title }
    })
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
          data.every(providerEntry => {
            const providerName = Object.keys(providerEntry)[0]
            const mangas = providerEntry[providerName]
            return mangas.length === 0
          }) ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <h2>No results found for this search</h2>
              <p>Try a different manga title.</p>
            </div>
          ) : (
            <Flex vertical gap="large">
              <h1>Search results:</h1>
              {data.map(providerEntry => {
                const providerName = Object.keys(providerEntry)[0]
                const mangas = providerEntry[providerName]

                return (
                  <div key={providerName}>
                    {mangas.length > 0 && (
                      <>
                        <h2 style={{ textTransform: 'capitalize' }}>{providerName}</h2>
                        <Flex gap="large" wrap style={{ marginBottom: 32 }}>
                          {mangas.map((manga: SearchType, index) => {
                            const src = requiresProxy(providerName)
                              ? proxiedImages[manga.coverUrl] || '/fallback.jpg'
                              : manga.coverUrl

                            return (
                              <Card
                                size="small"
                                key={index}
                                title={manga.title}
                                onClick={() => handleClick(providerName, manga.id, manga.title)}
                                style={{ width: '15%', cursor: 'pointer' }}
                              >
                                <Image
                                  preview={false}
                                  loading="lazy"
                                  src={src}
                                  fallback="/fallback.jpg"
                                />
                              </Card>
                            )
                          })}
                        </Flex>
                      </>
                    )}
                  </div>
                )
              })}
            </Flex>
          )
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
