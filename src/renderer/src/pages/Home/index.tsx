import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeContainer, MangaGrid } from './styles'
import { useSearchStore } from '../../Features/Store/Search/useSearchStore'
import { Flex, Image, Skeleton, Spin, Switch } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { SearchType } from '@renderer/types'
import { fetchProxiedImages, requiresProxy } from './proxyUtils'
import { groupMangasByName } from './groupUtils'
import { GroupedSearchView } from './GroupedSearchView'

type ImageMap = Record<string, string>

// Hook for draggable scroll
const useDraggableScroll = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      setStartX(e.pageX - element.offsetLeft)
      setScrollLeft(element.scrollLeft)
      element.style.cursor = 'grabbing'
      element.style.userSelect = 'none'
    }

    const handleMouseLeave = () => {
      setIsDragging(false)
      if (element) element.style.cursor = 'grab'
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      if (element) element.style.cursor = 'grab'
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      e.preventDefault()
      const x = e.pageX - element.offsetLeft
      const walk = (x - startX) * 2 // Scroll speed multiplier
      element.scrollLeft = scrollLeft - walk
    }

    element.addEventListener('mousedown', handleMouseDown)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mouseup', handleMouseUp)
    element.addEventListener('mousemove', handleMouseMove)

    return () => {
      element.removeEventListener('mousedown', handleMouseDown)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mouseup', handleMouseUp)
      element.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isDragging, startX, scrollLeft])

  return ref
}

const SkeletonCard = () => (
  <div 
    style={{ 
      minWidth: '200px', 
      maxWidth: '200px', 
      height: '280px',
      display: 'flex', 
      flexDirection: 'column', 
      flexShrink: 0,
      borderRadius: '8px',
      overflow: 'hidden'
    }}
  >
    <Skeleton.Image active style={{ width: '100%', height: '100%' }} />
  </div>
)

const MangaCard: React.FC<{
  manga: SearchType
  providerName: string
  proxiedImages: ImageMap
  onClick: () => void
}> = ({ manga, providerName, proxiedImages, onClick }) => {
  const [imageLoading, setImageLoading] = useState(true)

  const src = requiresProxy(providerName)
    ? (manga.coverUrl && proxiedImages[manga.coverUrl]) || '/fallback.jpg'
    : manga.coverUrl || '/fallback.jpg'

  return (
    <div
      onClick={onClick}
      style={{ 
        position: 'relative',
        minWidth: '200px', 
        maxWidth: '200px', 
        height: '280px',
        cursor: 'pointer', 
        flexShrink: 0,
        userSelect: 'none',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
    >
      {imageLoading && (
        <Flex
          align="center"
          justify="center"
          style={{ 
            height: '100%', 
            backgroundColor: '#f0f0f0',
            borderRadius: '8px'
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </Flex>
      )}
      <Image
        preview={false}
        loading="lazy"
        src={src}
        fallback="/fallback.jpg"
        onLoad={() => setImageLoading(false)}
        onError={() => setImageLoading(false)}
        onDragStart={(e) => e.preventDefault()}
        style={{ 
          display: imageLoading ? 'none' : 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      />
      {!imageLoading && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '10px',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, transparent 100%)',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical' as any,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word'
          }}
        >
          {manga.title}
        </div>
      )}
    </div>
  )
}

const ProviderSection: React.FC<{
  providerName: string
  mangas: SearchType[]
  proxiedImages: ImageMap
  onMangaClick: (provider: string, id: string, title: string) => void
}> = ({ providerName, mangas, proxiedImages, onMangaClick }) => {
  const scrollRef = useDraggableScroll()

  return (
    <div>
      <h2 style={{ textTransform: 'capitalize' }}>{providerName}</h2>
      {mangas.length > 0 ? (
        <Flex 
          ref={scrollRef}
          gap="large" 
          style={{ 
            marginBottom: 32,
            overflowX: 'auto',
            overflowY: 'visible',
            paddingBottom: '20px',
            paddingTop: '10px',
            cursor: 'grab'
          }}
        >
          {mangas.map((manga: SearchType, index) => (
            <MangaCard
              key={index}
              manga={manga}
              providerName={providerName}
              proxiedImages={proxiedImages}
              onClick={() => onMangaClick(providerName, manga.id, manga.title)}
            />
          ))}
        </Flex>
      ) : (
        <Flex 
          align="center" 
          justify="center" 
          style={{ 
            minWidth: '200px',
            maxWidth: '200px',
            height: '280px',
            backgroundColor: '#f5f5f5', 
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            flexShrink: 0
          }}
        >
          <span style={{ color: '#888', fontSize: '14px' }}>
            No mangas found
          </span>
        </Flex>
      )}
    </div>
  )
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { data, loadingProviders, providerOrder } = useSearchStore()
  const [proxiedImages, setProxiedImages] = useState<ImageMap>({})
  const [isAdvancedView, setIsAdvancedView] = useState(false)

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

  const hasAnyData = Array.isArray(data) && data.length > 0
  const isSearching = loadingProviders.size > 0

  // Group mangas for default view
  const groupedMangas = hasAnyData ? groupMangasByName(data, loadingProviders) : []

  return (
    <HomeContainer>
      <MangaGrid>
        {hasAnyData || isSearching ? (
          <Flex vertical gap="large">
            {/* Toggle between default and advanced view */}
            <Flex justify="space-between" align="center" style={{ marginBottom: '16px' }}>
              <h1 style={{ margin: 0 }}>Search results:</h1>
              <Flex align="center" gap="middle">
                <span style={{ color: '#888' }}>Grouped View</span>
                <Switch
                  checked={isAdvancedView}
                  onChange={setIsAdvancedView}
                  checkedChildren="Advanced"
                  unCheckedChildren="Default"
                />
              </Flex>
            </Flex>

            {/* Show appropriate view based on toggle */}
            {!isAdvancedView ? (
              /* Default grouped view */
              <GroupedSearchView
                groupedMangas={groupedMangas}
                loadingProviders={loadingProviders}
                proxiedImages={proxiedImages}
                onNavigate={handleClick}
              />
            ) : (
              /* Advanced view - show by provider */
              <>
                {/* Show results from completed providers */}
                {hasAnyData && data.map((providerEntry) => {
                  const providerName = Object.keys(providerEntry)[0]
                  const mangas = providerEntry[providerName]
                  
                  return <ProviderSection 
                    key={providerName}
                    providerName={providerName}
                    mangas={mangas}
                    proxiedImages={proxiedImages}
                    onMangaClick={handleClick}
                  />
                })}

            {/* Show loading skeleton for providers still fetching in original order */}
            {providerOrder
              .filter(provider => loadingProviders.has(provider))
              .map(provider => {
                const skeletonScrollRef = useDraggableScroll()
                return (
                  <div key={`loading-${provider}`}>
                    <h2 style={{ textTransform: 'capitalize' }}>{provider}</h2>
                    <Flex 
                      ref={skeletonScrollRef}
                      gap="large" 
                      style={{ 
                        marginBottom: 32,
                        overflowX: 'visible',
                        overflowY: 'visible',
                        paddingBottom: '20px',
                        paddingTop: '10px',
                        cursor: 'grab'
                      }}
                    >
                      {/* Show 6 skeleton cards to maintain layout */}
                      {[...Array(6)].map((_, index) => (
                        <SkeletonCard key={`skeleton-${provider}-${index}`} />
                      ))}
                    </Flex>
                  </div>
                )
              })}

                {/* Show "no results" only when all providers are done and ALL have no results */}
                {!isSearching && hasAnyData && data.every(providerEntry => {
                  const providerName = Object.keys(providerEntry)[0]
                  const mangas = providerEntry[providerName]
                  return mangas.length === 0
                }) && (
                  <Flex 
                    align="center" 
                    justify="center" 
                    vertical
                    style={{ 
                      padding: '60px', 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: '8px',
                      marginTop: '20px'
                    }}
                  >
                    <h2 style={{ margin: 0, marginBottom: '8px' }}>No results found</h2>
                    <p style={{ color: '#888', margin: 0 }}>Try a different manga title or select different providers.</p>
                  </Flex>
                )}
              </>
            )}
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
