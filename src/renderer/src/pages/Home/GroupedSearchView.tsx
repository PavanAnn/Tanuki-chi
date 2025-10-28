import React, { useState } from 'react'
import { Flex, Image, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { GroupedManga } from './groupUtils'
import { ProviderModal } from './ProviderModal'
import { requiresProxy } from './proxyUtils'

type ImageMap = Record<string, string>

const GroupedMangaCard: React.FC<{
  manga: GroupedManga
  proxiedImages: ImageMap
  onClick: () => void
}> = ({ manga, proxiedImages, onClick }) => {
  const [imageLoading, setImageLoading] = useState(true)

  // Use first provider's cover URL
  const firstProvider = manga.providers[0]?.provider || ''
  const coverUrl = manga.coverUrl || '/fallback.jpg'
  
  const src = requiresProxy(firstProvider)
    ? (coverUrl && proxiedImages[coverUrl]) || '/fallback.jpg'
    : coverUrl

  const providerCount = manga.providers.length

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
          style={{ height: '100%', backgroundColor: '#f0f0f0', borderRadius: '8px' }}
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
        <>
          {/* Provider count badge */}
          {providerCount > 1 && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {providerCount} {providerCount === 1 ? 'provider' : 'providers'}
            </div>
          )}
          {/* Title overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '10px',
              background:
                'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, transparent 100%)',
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
            {manga.displayName}
          </div>
        </>
      )}
    </div>
  )
}

interface GroupedSearchViewProps {
  groupedMangas: GroupedManga[]
  loadingProviders: Set<string>
  proxiedImages: ImageMap
  onNavigate: (provider: string, id: string, title: string) => void
}

export const GroupedSearchView: React.FC<GroupedSearchViewProps> = ({
  groupedMangas,
  loadingProviders,
  proxiedImages,
  onNavigate
}) => {
  const [selectedManga, setSelectedManga] = useState<GroupedManga | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleMangaClick = (manga: GroupedManga) => {
    if (manga.providers.length === 1) {
      // If only one provider, navigate directly
      const provider = manga.providers[0]
      onNavigate(provider.provider, provider.manga.id, provider.manga.title)
    } else {
      // Show modal for provider selection
      setSelectedManga(manga)
      setModalOpen(true)
    }
  }

  const handleSelectProvider = (provider: string, mangaId: string) => {
    if (selectedManga) {
      onNavigate(provider, mangaId, selectedManga.displayName)
      setModalOpen(false)
      setSelectedManga(null)
    }
  }

  return (
    <>
      <Flex vertical gap="large" style={{ position: 'relative' }}>
        {loadingProviders.size > 0 && (
          <Flex 
            align="center" 
            gap="small"
            style={{
              position: 'fixed',
              bottom: '25px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '12px 24px',
              borderRadius: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          >
            <Spin indicator={<LoadingOutlined spin />} size="small" />
            <span style={{ color: '#888', fontWeight: '500' }}>
              Loading from {loadingProviders.size} provider{loadingProviders.size > 1 ? 's' : ''}...
            </span>
          </Flex>
        )}

        <Flex
          wrap
          justify="space-between"
          style={{
            paddingTop: '10px',
            paddingBottom: '20px',
            gap: '16px'
          }}
        >
          {groupedMangas.map((manga) => (
            <GroupedMangaCard
              key={manga.normalizedName}
              manga={manga}
              proxiedImages={proxiedImages}
              onClick={() => handleMangaClick(manga)}
            />
          ))}
        </Flex>

        {groupedMangas.length === 0 && loadingProviders.size === 0 && (
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
            <p style={{ color: '#888', margin: 0 }}>
              Try a different manga title or select different providers.
            </p>
          </Flex>
        )}
      </Flex>

      <ProviderModal
        open={modalOpen}
        manga={selectedManga}
        loadingProviders={loadingProviders}
        onClose={() => {
          setModalOpen(false)
          setSelectedManga(null)
        }}
        onSelectProvider={handleSelectProvider}
      />
    </>
  )
}

